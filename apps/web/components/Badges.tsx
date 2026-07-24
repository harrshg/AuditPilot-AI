const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: 'bg-red-600/20 text-red-400 border-red-600/40',
  HIGH: 'bg-orange-600/20 text-orange-400 border-orange-600/40',
  MEDIUM: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/40',
  LOW: 'bg-blue-600/20 text-blue-400 border-blue-600/40',
  INFO: 'bg-slate-600/20 text-slate-300 border-slate-600/40',
};

const STATUS_COLORS: Record<string, string> = {
  QUEUED: 'bg-slate-600/20 text-slate-300 border-slate-600/40',
  RUNNING: 'bg-blue-600/20 text-blue-400 border-blue-600/40',
  COMPLETED: 'bg-green-600/20 text-green-400 border-green-600/40',
  FAILED: 'bg-red-600/20 text-red-400 border-red-600/40',
  CANCELLED: 'bg-slate-600/20 text-slate-400 border-slate-600/40',
};

function badgeClasses(colorClass: string): string {
  return `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorClass}`;
}

export function SeverityBadge({ severity }: { severity: string }) {
  return <span className={badgeClasses(SEVERITY_COLORS[severity] ?? SEVERITY_COLORS.INFO)}>{severity}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={badgeClasses(STATUS_COLORS[status] ?? STATUS_COLORS.QUEUED)}>{status}</span>;
}

export function ScoreBadge({ label, score }: { label: string; score: number | null | undefined }) {
  const value = score ?? null;
  const color =
    value === null
      ? 'text-slate-400'
      : value >= 80
        ? 'text-green-400'
        : value >= 50
          ? 'text-yellow-400'
          : 'text-red-400';

  return (
    <div className="flex flex-col items-center rounded-lg border border-border bg-surface px-4 py-3">
      <span className={`text-2xl font-semibold ${color}`}>{value === null ? '—' : value}</span>
      <span className="mt-1 text-xs text-slate-400">{label}</span>
    </div>
  );
}
