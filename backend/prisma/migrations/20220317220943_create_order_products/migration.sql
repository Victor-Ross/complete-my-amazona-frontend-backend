/*
  Warnings:

  - A unique constraint covering the columns `[fk_order_product]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fk_order_product` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "fk_order_product" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "orderproducts" (
    "id" TEXT NOT NULL,
    "fk_order_id" TEXT NOT NULL,
    "fk_product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "orderproducts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orderproducts_fk_product_id_key" ON "orderproducts"("fk_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_fk_order_product_key" ON "orders"("fk_order_product");

-- AddForeignKey
ALTER TABLE "orderproducts" ADD CONSTRAINT "orderproducts_fk_product_id_fkey" FOREIGN KEY ("fk_product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderproducts" ADD CONSTRAINT "orderproducts_fk_order_id_fkey" FOREIGN KEY ("fk_order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
