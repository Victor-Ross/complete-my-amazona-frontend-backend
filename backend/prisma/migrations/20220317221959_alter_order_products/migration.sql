/*
  Warnings:

  - You are about to drop the column `fk_order_product` on the `orders` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "orders_fk_order_product_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "fk_order_product";
