'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createScan } from '@/lib/api';

export default function NewScanPage() {
  const router = useRouter();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [allowedDomains, setAllowedDomains] = useState('');
  const [scanMode, setScanMode] = useState('quick');
  const [maxCrawlDepth, setMaxCrawlDepth] = useState(2);
  const [maxPages, setMaxPages] = useState(25);
  const [testerName, setTesterName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [allowFormSubmission, setAllowFormSubmission] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(undefined);

    if (!isAuthorized) {
      setError('You must confirm authorization to scan this website.');
      return;
    }

    setSubmitting(true);

    try {
      const domains = allowedDomains
        .split(',')
        .map((domain) => domain.trim())
        .filter(Boolean);

      const { scanId } = await createScan({
        websiteUrl,
        allowedDomains: domains.length > 0 ? domains : [new URL(websiteUrl).hostname],
        excludedPaths: [],
        scanMode,
        maxCrawlDepth,
        maxPages,
        safety: {
          safeMode: true,
          allowDestructiveActions: false,
          allowFormSubmission,
          allowFileUploadTesting: false,
          allowPaymentFlowTesting: false,
        },
        authorization: {
          isAuthorizedToTest: true,
          acceptedTermsAt: new Date().toISOString(),
          testerName,
          organizationName: organizationName || undefined,
        },
      });

      router.push(`/scans/${scanId}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to create scan.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold">New Scan</h1>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-border bg-surface p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">Website URL</label>
          <input
            required
            type="url"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Allowed domains (comma separated, optional)
          </label>
          <input
            type="text"
            value={allowedDomains}
            onChange={(event) => setAllowedDomains(event.target.value)}
            placeholder="example.com, app.example.com"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Scan mode</label>
            <select
              value={scanMode}
              onChange={(event) => setScanMode(event.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
            >
              <option value="quick">Quick</option>
              <option value="deep">Deep</option>
              <option value="security-focused">Security-focused</option>
              <option value="performance-focused">Performance-focused</option>
              <option value="full-qa">Full QA</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Max depth</label>
            <input
              type="number"
              min={0}
              max={10}
              value={maxCrawlDepth}
              onChange={(event) => setMaxCrawlDepth(Number(event.target.value))}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Max pages</label>
            <input
              type="number"
              min={1}
              max={250}
              value={maxPages}
              onChange={(event) => setMaxPages(Number(event.target.value))}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={allowFormSubmission}
            onChange={(event) => setAllowFormSubmission(event.target.checked)}
          />
          Allow form submission during crawl
        </label>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Tester name</label>
            <input
              required
              type="text"
              value={testerName}
              onChange={(event) => setTesterName(event.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Organization (optional)</label>
            <input
              type="text"
              value={organizationName}
              onChange={(event) => setOrganizationName(event.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 rounded-md border border-yellow-600/40 bg-yellow-600/10 p-3 text-sm text-yellow-200">
          <input
            type="checkbox"
            checked={isAuthorized}
            onChange={(event) => setIsAuthorized(event.target.checked)}
            className="mt-1"
          />
          I confirm I am authorized to run defensive security and QA tests against this website.
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {submitting ? 'Starting scan...' : 'Start Scan'}
        </button>
      </form>
    </div>
  );
}
