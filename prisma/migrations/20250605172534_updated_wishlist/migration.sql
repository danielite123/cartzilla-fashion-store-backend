/*
  Warnings:

  - You are about to drop the column `quantity` on the `WishlistItem` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `WishlistItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WishlistItem" DROP COLUMN "quantity",
DROP COLUMN "size";
