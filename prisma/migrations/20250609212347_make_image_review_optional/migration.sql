-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_imageId_fkey";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "imageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
