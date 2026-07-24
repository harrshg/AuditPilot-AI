import { compareScans } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function CompareScansPage({
  params,
}: {
  params: { id: string; otherId: string };
}) {
  const comparison = await compareScans(params.id, params.otherId);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold">Scan Comparison</h1>

      <div className="mb-8 grid grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-slate-400">Scan A</p>
          <p className="font-mono text-sm text-slate-200">{comparison.scanA.id}</p>
          <p className="mt-2 text-sm text-slate-300">{comparison.scanA.issueCount} issue(s)</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-slate-400">Scan B</p>
          <p className="font-mono text-sm text-slate-200">{comparison.scanB.id}</p>
          <p className="mt-2 text-sm text-slate-300">{comparison.scanB.issueCount} issue(s)</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Score deltas (B − A)</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.entries(comparison.scoreDelta).map(([key, value]) => (
            <div key={key} className="rounded-lg border border-border bg-surface p-3 text-center">
              <p className={`text-lg font-semibold ${(value ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {(value ?? 0) >= 0 ? '+' : ''}
                {value}
              </p>
              <p className="mt-1 text-xs text-slate-400">{key}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold text-red-300">New issues in B ({comparison.issuesOnlyInB.length})</h2>
        <ul className="list-inside list-disc text-sm text-slate-300">
          {comparison.issuesOnlyInB.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-green-300">
          Resolved since A ({comparison.issuesOnlyInA.length})
        </h2>
        <ul className="list-inside list-disc text-sm text-slate-300">
          {comparison.issuesOnlyInA.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
