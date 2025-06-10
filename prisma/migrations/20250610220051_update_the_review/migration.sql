/*
  Warnings:

  - You are about to drop the column `imageId` on the `Review` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_imageId_fkey";

-- DropIndex
DROP INDEX "Review_imageId_key";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "imageId";
