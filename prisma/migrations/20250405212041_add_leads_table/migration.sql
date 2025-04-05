-- CreateTable
CREATE TABLE "leads" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "message" TEXT,
    "sourceFormName" TEXT NOT NULL,
    "submissionUrl" TEXT NOT NULL,
    "submissionTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "status" TEXT NOT NULL DEFAULT 'New',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leads_email_key" ON "leads"("email");

-- CreateIndex
CREATE INDEX "leads_sourceFormName_idx" ON "leads"("sourceFormName");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_submissionTimestamp_idx" ON "leads"("submissionTimestamp");
