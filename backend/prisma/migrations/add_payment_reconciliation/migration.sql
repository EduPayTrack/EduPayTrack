-- CreateEnum
CREATE TYPE "ReconciliationStatus" AS ENUM ('UNMATCHED', 'MATCHED');

-- AlterTable
ALTER TABLE "Payment"
ADD COLUMN "reconciliationStatus" "ReconciliationStatus" NOT NULL DEFAULT 'UNMATCHED',
ADD COLUMN "reconciliationNote" TEXT,
ADD COLUMN "reconciledAt" TIMESTAMP(3),
ADD COLUMN "reconciledBy" TEXT;

-- AddForeignKey
ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_reconciledBy_fkey" FOREIGN KEY ("reconciledBy") REFERENCES "User"("id") ON DELETE SET NULL;
