import Link from 'next/link';

import { SeverityBadge } from '@/components/Badges';
import { getScan } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function IssueDetailPage({
  params,
}: {
  params: { id: string; issueId: string };
}) {
  const scan = await getScan(params.id);
  const issue = scan.issues.find((candidate) => candidate.id === params.issueId);

  if (!issue) {
    return <p className="text-sm text-red-400">Issue not found in this scan.</p>;
  }

  const evidence = issue.evidence ?? {};
  const rootCause = typeof evidence.rootCause === 'object' ? evidence.rootCause : undefined;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={`/scans/${scan.id}`} className="text-sm text-blue-400 hover:underline">
        &larr; Back to scan report
      </Link>

      <div className="mt-4 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{issue.title}</h1>
        <SeverityBadge severity={issue.severity} />
      </div>

      <div className="mb-6 rounded-lg border border-border bg-surface p-4">
        <p className="text-sm text-slate-300">{issue.description}</p>
        <div className="mt-3 flex gap-4 text-xs text-slate-400">
          <span>Category: {issue.category}</span>
          {issue.affectedUrl && <span>URL: {issue.affectedUrl}</span>}
          {issue.affectedEndpoint && <span>Endpoint: {issue.affectedEndpoint}</span>}
        </div>
      </div>

      {rootCause && (
        <div className="mb-6 rounded-lg border border-purple-600/40 bg-purple-600/10 p-4">
          <h2 className="mb-1 text-sm font-semibold text-purple-300">AI Root Cause Hypothesis</h2>
          <p className="text-sm text-purple-200">{(rootCause as { hypothesis?: string }).hypothesis}</p>
        </div>
      )}

      {issue.recommendationText && (
        <div className="mb-6 rounded-lg border border-green-600/40 bg-green-600/10 p-4">
          <h2 className="mb-1 text-sm font-semibold text-green-300">Recommendation</h2>
          <p className="text-sm text-green-200">{issue.recommendationText}</p>
        </div>
      )}

      <div className="mb-6 rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-200">Evidence</h2>
        <pre className="overflow-x-auto text-xs text-slate-400">{JSON.stringify(evidence, null, 2)}</pre>
      </div>

      {issue.generatedTests && issue.generatedTests.length > 0 && (
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-200">Generated Regression Test</h2>
          {issue.generatedTests.map((test) => (
            <div key={test.id} className="mb-3">
              <p className="mb-1 text-xs text-slate-400">{test.fileName}</p>
              <pre className="overflow-x-auto rounded bg-background p-3 text-xs text-slate-300">{test.content}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
