/*
  Warnings:

  - Added the required column `image` to the `orderproducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `orderproducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `orderproducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `orderproducts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orderproducts" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;
