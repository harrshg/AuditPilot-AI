import { randomUUID } from 'node:crypto';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';

import {
  compareScans,
  createScan,
  createScanConfig,
  defaultSecretsProvider,
  getOrCreateDefaultProject,
  getScanById,
  listScans,
  mapScanModeToPrisma,
} from '@auditpilot/db';
import { canPerformAction, createScanJob, isValidTeamRole, ScanJob, TeamRole, validateScanScope } from '@auditpilot/shared';

const DEFAULT_PORT = 3001;
const jobs = new Map<string, ScanJob>();

export type ApiServerOptions = {
  port?: number;
  host?: string;
};

export const apiService = {
  name: '@auditpilot/api',
  createServer: createApiServer,
  jobs,
};

export function createApiServer() {
  return createServer(async (request, response) => {
    try {
      await routeRequest(request, response);
    } catch (error) {
      sendJson(response, 500, {
        error: 'internal_server_error',
        message: error instanceof Error ? error.message : 'Unexpected API server error',
      });
    }
  });
}

export function startApiServer(options: ApiServerOptions = {}) {
  const port = options.port ?? Number(process.env.PORT ?? DEFAULT_PORT);
  const host = options.host ?? process.env.HOST ?? '0.0.0.0';
  const server = createApiServer();

  server.listen(port, host, () => {
    process.stdout.write(`AuditPilot API listening on http://${host}:${port}\n`);
  });

  return server;
}

async function routeRequest(request: IncomingMessage, response: ServerResponse) {
  const method = request.method ?? 'GET';
  const url = new URL(request.url ?? '/', 'http://localhost');

  if (method === 'GET' && url.pathname === '/health') {
    sendJson(response, 200, {
      status: 'ok',
      service: '@auditpilot/api',
    });
    return;
  }

  if (method === 'GET' && url.pathname === '/v1') {
    sendJson(response, 200, {
      service: '@auditpilot/api',
      endpoints: [
        'GET /health',
        'GET /v1',
        'POST /v1/scans',
        'GET /v1/scans',
        'GET /v1/scans/:id',
        'GET /v1/scans/:idA/compare/:idB',
        'GET /v1/jobs/:id',
      ],
    });
    return;
  }

  if (method === 'POST' && url.pathname === '/v1/scans') {
    const role = resolveTeamRole(request);
    if (!canPerformAction(role, 'create_scan')) {
      sendJson(response, 403, {
        error: 'forbidden',
        message: `Role '${role}' is not permitted to create scans.`,
      });
      return;
    }

    const body = await readJsonBody(request);
    const validation = validateScanScope(body);

    if (!validation.valid || !validation.normalizedConfig) {
      sendJson(response, 400, {
        error: 'invalid_scan_config',
        details: validation.errors,
      });
      return;
    }

    const { projectId, userId } = await getOrCreateDefaultProject();
    const config = validation.normalizedConfig;

    let credentialsSecretRef: string | undefined;
    if (config.credentials) {
      credentialsSecretRef = randomUUID();
      await defaultSecretsProvider.store(credentialsSecretRef, config.credentials);
    }

    const scanConfigRow = await createScanConfig({
      projectId,
      name: `Scan of ${safeHostname(config.websiteUrl)}`,
      websiteUrl: config.websiteUrl,
      loginUrl: config.credentials?.loginUrl,
      issueDescription: config.issueDescription,
      scanMode: mapScanModeToPrisma(config.scanMode),
      maxCrawlDepth: config.maxCrawlDepth,
      maxPages: config.maxPages,
      allowedDomains: config.allowedDomains,
      excludedPaths: config.excludedPaths,
      safeMode: config.safety.safeMode,
      allowDestructiveActions: config.safety.allowDestructiveActions,
      allowFormSubmission: config.safety.allowFormSubmission,
      allowFileUploadTesting: config.safety.allowFileUploadTesting,
      allowPaymentFlowTesting: config.safety.allowPaymentFlowTesting,
      authorizationTesterName: config.authorization.testerName,
      authorizationOrgName: config.authorization.organizationName,
      authorizationAcceptedAt: new Date(config.authorization.acceptedTermsAt),
      authorizationNotes: config.authorization.notes,
      credentialsSecretRef,
    });

    const scan = await createScan({
      projectId,
      scanConfigId: scanConfigRow.id,
      requestedByUserId: userId,
      mode: mapScanModeToPrisma(config.scanMode),
      targetUrl: config.websiteUrl,
    });

    const job = createScanJob({
      id: scan.id,
      priority: 'normal',
      trigger: 'api',
      maxAttempts: 3,
      payload: {
        scanConfig: config,
        projectId,
        requestedByUserId: userId,
      },
    });

    jobs.set(job.id, job);

    sendJson(response, 202, {
      job,
      scanId: scan.id,
    });
    return;
  }

  if (method === 'GET' && url.pathname === '/v1/scans') {
    const projectId = url.searchParams.get('projectId') ?? undefined;
    const scans = await listScans(projectId);
    sendJson(response, 200, { scans });
    return;
  }

  if (method === 'GET' && /^\/v1\/scans\/[^/]+\/compare\/[^/]+$/.test(url.pathname)) {
    const [, , , scanIdA, , scanIdB] = url.pathname.split('/');
    try {
      const comparison = await compareScans(scanIdA, scanIdB);
      sendJson(response, 200, { comparison });
    } catch (error) {
      sendJson(response, 404, {
        error: 'comparison_failed',
        message: error instanceof Error ? error.message : 'Unable to compare scans',
      });
    }
    return;
  }

  if (method === 'GET' && url.pathname.startsWith('/v1/scans/')) {
    const scanId = url.pathname.replace('/v1/scans/', '').trim();
    const scan = await getScanById(scanId);

    if (!scan) {
      sendJson(response, 404, {
        error: 'scan_not_found',
        message: `No scan found for id '${scanId}'`,
      });
      return;
    }

    sendJson(response, 200, { scan });
    return;
  }

  if (method === 'GET' && url.pathname.startsWith('/v1/jobs/')) {
    const jobId = url.pathname.replace('/v1/jobs/', '').trim();
    const job = jobs.get(jobId);

    if (!job) {
      sendJson(response, 404, {
        error: 'job_not_found',
        message: `No scan job found for id '${jobId}'`,
      });
      return;
    }

    sendJson(response, 200, {
      job,
    });
    return;
  }

  sendJson(response, 404, {
    error: 'not_found',
    message: `${method} ${url.pathname} is not supported`,
  });
}

async function readJsonBody(request: IncomingMessage) {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return undefined;
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    throw new Error('Request body must be valid JSON');
  }
}

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function resolveTeamRole(request: IncomingMessage): TeamRole {
  const header = request.headers['x-user-role'];
  const value = Array.isArray(header) ? header[0] : header;
  return value && isValidTeamRole(value) ? value : 'MEMBER';
}

function sendJson(response: ServerResponse, statusCode: number, body: unknown) {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(body, null, 2));
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  startApiServer();
}
