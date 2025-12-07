-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRequestStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "VerificationRequestStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DocumentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InquiryStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "InquiryStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRequestDocumentType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "VerificationRequestDocumentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEntity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AuditEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barangay" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3),

    CONSTRAINT "Barangay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3),
    "googleId" INTEGER,
    "roleId" INTEGER NOT NULL,
    "barangayId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" SERIAL NOT NULL,
    "remarks" TEXT,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "reviewedBy" INTEGER,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRequestDocuments" (
    "id" SERIAL NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "requestId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,

    CONSTRAINT "VerificationRequestDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" SERIAL NOT NULL,
    "config" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "barangayId" INTEGER NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "year" INTEGER,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3),
    "barangayId" INTEGER NOT NULL,
    "uploadedBy" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" SERIAL NOT NULL,
    "senderLastName" TEXT,
    "senderFirstName" TEXT,
    "senderEmail" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3),
    "responseMessage" TEXT,
    "barangayId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "respondedBy" INTEGER,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "entityId" INTEGER NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequestStatus_name_key" ON "VerificationRequestStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentType_name_key" ON "DocumentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InquiryStatus_name_key" ON "InquiryStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequestDocumentType_name_key" ON "VerificationRequestDocumentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AuditEntity_name_key" ON "AuditEntity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Barangay_slug_key" ON "Barangay"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Theme_barangayId_key" ON "Theme"("barangayId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "Barangay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "VerificationRequestStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequestDocuments" ADD CONSTRAINT "VerificationRequestDocuments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "VerificationRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequestDocuments" ADD CONSTRAINT "VerificationRequestDocuments_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "VerificationRequestDocumentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "Barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "Barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "DocumentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "Barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "InquiryStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_respondedBy_fkey" FOREIGN KEY ("respondedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "AuditEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
