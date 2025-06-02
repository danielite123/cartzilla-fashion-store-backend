/*
  Warnings:

  - Added the required column `hex` to the `ColorVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ColorVariant" ADD COLUMN     "hex" TEXT NOT NULL;
