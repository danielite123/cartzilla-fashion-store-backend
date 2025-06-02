-- DropForeignKey
ALTER TABLE "ColorVariant" DROP CONSTRAINT "ColorVariant_productId_fkey";

-- AlterTable
ALTER TABLE "ColorVariant" ALTER COLUMN "productId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ColorVariant" ADD CONSTRAINT "ColorVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
