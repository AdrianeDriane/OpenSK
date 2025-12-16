-- AlterTable
ALTER TABLE "VerificationRequest" ADD COLUMN     "barangayId" INTEGER,
ADD COLUMN     "rejectionReason" TEXT;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "Barangay"("id") ON DELETE SET NULL ON UPDATE CASCADE;
