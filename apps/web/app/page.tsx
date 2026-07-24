import Link from 'next/link';

import { StatusBadge } from '@/components/Badges';
import { listScans } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let scans;
  let error: string | undefined;

  try {
    scans = await listScans();
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : 'Failed to load scans.';
    scans = [];
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Scan Reports</h1>
        <Link
          href="/scans/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          New Scan
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-600/40 bg-red-600/10 p-4 text-sm text-red-300">
          Could not reach the AuditPilot API: {error}
        </div>
      )}

      {scans.length === 0 && !error && (
        <div className="rounded-lg border border-border bg-surface p-8 text-center text-slate-400">
          No scans yet. Start your first defensive audit scan.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {scans.map((scan) => (
          <Link
            key={scan.id}
            href={`/scans/${scan.id}`}
            className="flex items-center justify-between rounded-lg border border-border bg-surface p-4 transition hover:border-blue-500/60"
          >
            <div>
              <p className="font-medium text-slate-100">{scan.targetUrl}</p>
              <p className="mt-1 text-xs text-slate-400">
                {scan.mode} · started {new Date(scan.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {scan.overallHealthScore !== null && (
                <span className="text-lg font-semibold text-slate-200">{scan.overallHealthScore}</span>
              )}
              <StatusBadge status={scan.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
