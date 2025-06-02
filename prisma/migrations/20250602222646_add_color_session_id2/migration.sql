/*
  Warnings:

  - You are about to drop the column `colorSessionId` on the `Image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ColorVariant" ADD COLUMN     "colorSessionId" TEXT;

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "colorSessionId";
