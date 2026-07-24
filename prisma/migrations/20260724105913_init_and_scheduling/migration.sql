-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "ScanMode" AS ENUM ('QUICK', 'DEEP', 'SECURITY_FOCUSED', 'PERFORMANCE_FOCUSED', 'FULL_QA');

-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ScanEventLevel" AS ENUM ('DEBUG', 'INFO', 'WARN', 'ERROR');

-- CreateEnum
CREATE TYPE "IssueSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO');

-- CreateEnum
CREATE TYPE "IssueCategory" AS ENUM ('SECURITY', 'PERFORMANCE', 'FRONTEND', 'BACKEND_API', 'NETWORK', 'ACCESSIBILITY', 'SERVER_CONFIG', 'RELIABILITY', 'TEST_COVERAGE');

-- CreateEnum
CREATE TYPE "ArtifactType" AS ENUM ('SCREENSHOT', 'VIDEO', 'TRACE', 'HAR', 'LOG', 'REPORT_JSON', 'REPORT_MARKDOWN', 'GENERATED_TEST_ARCHIVE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "baseUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_configs" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "loginUrl" TEXT,
    "issueDescription" TEXT,
    "scanMode" "ScanMode" NOT NULL DEFAULT 'QUICK',
    "maxCrawlDepth" INTEGER NOT NULL DEFAULT 2,
    "maxPages" INTEGER NOT NULL DEFAULT 25,
    "allowedDomains" JSONB NOT NULL,
    "excludedPaths" JSONB NOT NULL,
    "safeMode" BOOLEAN NOT NULL DEFAULT true,
    "allowDestructiveActions" BOOLEAN NOT NULL DEFAULT false,
    "allowFormSubmission" BOOLEAN NOT NULL DEFAULT false,
    "allowFileUploadTesting" BOOLEAN NOT NULL DEFAULT false,
    "allowPaymentFlowTesting" BOOLEAN NOT NULL DEFAULT false,
    "authorizationTesterName" TEXT NOT NULL,
    "authorizationOrgName" TEXT,
    "authorizationAcceptedAt" TIMESTAMP(3) NOT NULL,
    "authorizationNotes" TEXT,
    "credentialsSecretRef" TEXT,
    "scheduleCron" TEXT,
    "scheduleEnabled" BOOLEAN NOT NULL DEFAULT false,
    "nextRunAt" TIMESTAMP(3),
    "lastScheduledRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scan_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scans" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "scanConfigId" TEXT,
    "requestedByUserId" TEXT,
    "status" "ScanStatus" NOT NULL DEFAULT 'QUEUED',
    "mode" "ScanMode" NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "overallHealthScore" INTEGER,
    "securityScore" INTEGER,
    "performanceScore" INTEGER,
    "frontendQualityScore" INTEGER,
    "backendApiScore" INTEGER,
    "accessibilityScore" INTEGER,
    "reliabilityScore" INTEGER,
    "testCoverageScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scan_events" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "level" "ScanEventLevel" NOT NULL DEFAULT 'INFO',
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "statusCode" INTEGER,
    "loadTimeMs" INTEGER,
    "screenshotPath" TEXT,
    "domSnapshotRef" TEXT,
    "discoveredFrom" TEXT,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "network_requests" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "pageUrl" TEXT,
    "requestUrl" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER,
    "resourceType" TEXT,
    "durationMs" INTEGER,
    "requestBytes" INTEGER,
    "responseBytes" INTEGER,
    "failed" BOOLEAN NOT NULL DEFAULT false,
    "failureText" TEXT,
    "requestHeaders" JSONB,
    "responseHeaders" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "network_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "console_logs" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "pageUrl" TEXT,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "location" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "console_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issues" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "IssueCategory" NOT NULL,
    "severity" "IssueSeverity" NOT NULL,
    "affectedUrl" TEXT,
    "affectedEndpoint" TEXT,
    "evidence" JSONB,
    "reproductionSteps" JSONB,
    "recommendationText" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "issueId" TEXT,
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 3,
    "estimatedEffort" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_tests" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "issueId" TEXT,
    "fileName" TEXT NOT NULL,
    "framework" TEXT NOT NULL DEFAULT 'playwright',
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generated_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artifacts" (
    "id" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    "type" "ArtifactType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "projects_ownerId_idx" ON "projects"("ownerId");

-- CreateIndex
CREATE INDEX "scan_configs_projectId_idx" ON "scan_configs"("projectId");

-- CreateIndex
CREATE INDEX "scan_configs_scheduleEnabled_nextRunAt_idx" ON "scan_configs"("scheduleEnabled", "nextRunAt");

-- CreateIndex
CREATE INDEX "scans_projectId_idx" ON "scans"("projectId");

-- CreateIndex
CREATE INDEX "scans_scanConfigId_idx" ON "scans"("scanConfigId");

-- CreateIndex
CREATE INDEX "scans_requestedByUserId_idx" ON "scans"("requestedByUserId");

-- CreateIndex
CREATE INDEX "scans_status_idx" ON "scans"("status");

-- CreateIndex
CREATE INDEX "scans_createdAt_idx" ON "scans"("createdAt");

-- CreateIndex
CREATE INDEX "scan_events_scanId_idx" ON "scan_events"("scanId");

-- CreateIndex
CREATE INDEX "scan_events_level_idx" ON "scan_events"("level");

-- CreateIndex
CREATE INDEX "pages_scanId_idx" ON "pages"("scanId");

-- CreateIndex
CREATE INDEX "pages_url_idx" ON "pages"("url");

-- CreateIndex
CREATE INDEX "network_requests_scanId_idx" ON "network_requests"("scanId");

-- CreateIndex
CREATE INDEX "network_requests_statusCode_idx" ON "network_requests"("statusCode");

-- CreateIndex
CREATE INDEX "network_requests_failed_idx" ON "network_requests"("failed");

-- CreateIndex
CREATE INDEX "network_requests_requestUrl_idx" ON "network_requests"("requestUrl");

-- CreateIndex
CREATE INDEX "console_logs_scanId_idx" ON "console_logs"("scanId");

-- CreateIndex
CREATE INDEX "console_logs_type_idx" ON "console_logs"("type");

-- CreateIndex
CREATE INDEX "issues_scanId_idx" ON "issues"("scanId");

-- CreateIndex
CREATE INDEX "issues_category_idx" ON "issues"("category");

-- CreateIndex
CREATE INDEX "issues_severity_idx" ON "issues"("severity");

-- CreateIndex
CREATE INDEX "issues_status_idx" ON "issues"("status");

-- CreateIndex
CREATE INDEX "recommendations_scanId_idx" ON "recommendations"("scanId");

-- CreateIndex
CREATE INDEX "recommendations_issueId_idx" ON "recommendations"("issueId");

-- CreateIndex
CREATE INDEX "recommendations_priority_idx" ON "recommendations"("priority");

-- CreateIndex
CREATE INDEX "generated_tests_scanId_idx" ON "generated_tests"("scanId");

-- CreateIndex
CREATE INDEX "generated_tests_issueId_idx" ON "generated_tests"("issueId");

-- CreateIndex
CREATE INDEX "artifacts_scanId_idx" ON "artifacts"("scanId");

-- CreateIndex
CREATE INDEX "artifacts_type_idx" ON "artifacts"("type");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_configs" ADD CONSTRAINT "scan_configs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scans" ADD CONSTRAINT "scans_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scans" ADD CONSTRAINT "scans_scanConfigId_fkey" FOREIGN KEY ("scanConfigId") REFERENCES "scan_configs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scans" ADD CONSTRAINT "scans_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_events" ADD CONSTRAINT "scan_events_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "scans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "scans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_requests" ADD CONSTRAINT "network_requests_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "scans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "console_logs" ADD CONSTRAINT "console_logs_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "scans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "scans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "scans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_tests" ADD CONSTRAINT "generated_tests_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "scans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_tests" ADD CONSTRAINT "generated_tests_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issues"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artifacts" ADD CONSTRAINT "artifacts_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "scans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
