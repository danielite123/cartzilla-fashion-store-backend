/*
  Warnings:

  - A unique constraint covering the columns `[imageId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "imageId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_imageId_key" ON "Review"("imageId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
