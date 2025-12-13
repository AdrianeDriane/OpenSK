-- CreateEnum
CREATE TYPE "SKOfficialRole" AS ENUM ('SK_COUNCILOR', 'CHAIRMAN', 'TREASURER', 'SECRETARY');

-- CreateTable
CREATE TABLE "SKOfficial" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" "SKOfficialRole" NOT NULL,
    "email" TEXT,
    "contactNumber" TEXT,
    "facebookProfile" TEXT,
    "imageUrl" TEXT,
    "imageKey" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "barangayId" INTEGER NOT NULL,
    "createdBy" INTEGER,

    CONSTRAINT "SKOfficial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SKOfficial_barangayId_idx" ON "SKOfficial"("barangayId");

-- AddForeignKey
ALTER TABLE "SKOfficial" ADD CONSTRAINT "SKOfficial_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "Barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SKOfficial" ADD CONSTRAINT "SKOfficial_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
