/*
  Warnings:

  - You are about to drop the column `fk_order_id` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_fk_order_id_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "fk_order_id";
