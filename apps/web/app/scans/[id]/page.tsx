'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ScoreBadge, SeverityBadge, StatusBadge } from '@/components/Badges';
import { getScan, ScanDetail } from '@/lib/api';

const POLL_INTERVAL_MS = 4000;
const ACTIVE_STATUSES = new Set(['QUEUED', 'RUNNING']);

export default function ScanDetailPage({ params }: { params: { id: string } }) {
  const [scan, setScan] = useState<ScanDetail | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function load() {
      try {
        const data = await getScan(params.id);
        if (cancelled) return;
        setScan(data);
        setError(undefined);

        if (ACTIVE_STATUSES.has(data.status)) {
          timer = setTimeout(load, POLL_INTERVAL_MS);
        }
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : 'Failed to load scan.');
        timer = setTimeout(load, POLL_INTERVAL_MS);
      }
    }

    load();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [params.id]);

  function handleExport() {
    if (!scan) return;
    const blob = new Blob([JSON.stringify(scan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `auditpilot-scan-${scan.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (error && !scan) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (!scan) {
    return <p className="text-sm text-slate-400">Loading scan...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{scan.targetUrl}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {scan.mode} · created {new Date(scan.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={scan.status} />
          <button
            onClick={handleExport}
            className="rounded-md border border-border px-3 py-1.5 text-sm text-slate-200 hover:border-blue-500"
          >
            Export JSON
          </button>
        </div>
      </div>

      {ACTIVE_STATUSES.has(scan.status) && (
        <div className="mb-6 rounded-lg border border-blue-600/40 bg-blue-600/10 p-4 text-sm text-blue-200">
          Scan is {scan.status.toLowerCase()}. This page updates automatically every few seconds.
        </div>
      )}

      {scan.status === 'FAILED' && scan.failureReason && (
        <div className="mb-6 rounded-lg border border-red-600/40 bg-red-600/10 p-4 text-sm text-red-300">
          Scan failed: {scan.failureReason}
        </div>
      )}

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ScoreBadge label="Overall" score={scan.overallHealthScore} />
        <ScoreBadge label="Security" score={scan.securityScore} />
        <ScoreBadge label="Performance" score={scan.performanceScore} />
        <ScoreBadge label="Frontend" score={scan.frontendQualityScore} />
        <ScoreBadge label="Backend API" score={scan.backendApiScore} />
        <ScoreBadge label="Accessibility" score={scan.accessibilityScore} />
        <ScoreBadge label="Reliability" score={scan.reliabilityScore} />
        <ScoreBadge label="Test coverage" score={scan.testCoverageScore} />
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Issues ({scan.issues.length})</h2>
        <div className="space-y-2">
          {scan.issues.map((issue) => (
            <Link
              key={issue.id}
              href={`/scans/${scan.id}/issues/${issue.id}`}
              className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 hover:border-blue-500/60"
            >
              <div>
                <p className="text-sm font-medium text-slate-100">{issue.title}</p>
                <p className="text-xs text-slate-400">
                  {issue.category} {issue.affectedUrl ? `· ${issue.affectedUrl}` : ''}
                </p>
              </div>
              <SeverityBadge severity={issue.severity} />
            </Link>
          ))}
          {scan.issues.length === 0 && <p className="text-sm text-slate-400">No issues recorded yet.</p>}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Activity log</h2>
        <div className="space-y-1 rounded-lg border border-border bg-surface p-4 font-mono text-xs text-slate-400">
          {scan.events.map((event) => (
            <p key={event.id}>
              [{new Date(event.createdAt).toLocaleTimeString()}] {event.level}: {event.message}
            </p>
          ))}
          {scan.events.length === 0 && <p>No events yet.</p>}
        </div>
      </section>
    </div>
  );
}
