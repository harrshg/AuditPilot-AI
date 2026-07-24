import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'AuditPilot AI',
  description: 'AI-assisted defensive web application audit dashboard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
          <header className="mb-8 flex items-center justify-between border-b border-border pb-4">
            <Link href="/" className="text-lg font-semibold text-slate-100">
              AuditPilot <span className="text-blue-400">AI</span>
            </Link>
            <nav className="flex gap-4 text-sm text-slate-300">
              <Link href="/" className="hover:text-white">
                Dashboard
              </Link>
              <Link href="/scans/new" className="hover:text-white">
                New Scan
              </Link>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
