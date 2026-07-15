import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';

import { createScanJob, ScanJob, validateScanScope } from '@auditpilot/shared';

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
        'GET /v1/jobs/:id',
      ],
    });
    return;
  }

  if (method === 'POST' && url.pathname === '/v1/scans') {
    const body = await readJsonBody(request);
    const validation = validateScanScope(body);

    if (!validation.valid || !validation.normalizedConfig) {
      sendJson(response, 400, {
        error: 'invalid_scan_config',
        details: validation.errors,
      });
      return;
    }

    const job = createScanJob({
      id: randomUUID(),
      priority: 'normal',
      trigger: 'api',
      maxAttempts: 3,
      payload: {
        scanConfig: validation.normalizedConfig,
      },
    });

    jobs.set(job.id, job);

    sendJson(response, 202, {
      job,
    });
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

function sendJson(response: ServerResponse, statusCode: number, body: unknown) {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(body, null, 2));
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  startApiServer();
}
