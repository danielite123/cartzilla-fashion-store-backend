/*
  Warnings:

  - A unique constraint covering the columns `[imageId]` on the table `ColorVariant` will be added. If there are existing duplicate values, this will fail.
  - Made the column `imageId` on table `ColorVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ColorVariant" DROP CONSTRAINT "ColorVariant_imageId_fkey";

-- AlterTable
ALTER TABLE "ColorVariant" ALTER COLUMN "imageId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ColorVariant_imageId_key" ON "ColorVariant"("imageId");

-- AddForeignKey
ALTER TABLE "ColorVariant" ADD CONSTRAINT "ColorVariant_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
