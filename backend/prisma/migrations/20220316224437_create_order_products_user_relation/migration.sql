-- AlterTable
ALTER TABLE "products" ADD COLUMN     "fk_order_id" TEXT;

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "items_price" DOUBLE PRECISION NOT NULL,
    "shipping_price" DOUBLE PRECISION NOT NULL,
    "tax_price" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "payment_method" TEXT NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "paid_at" TIMESTAMP(3) NOT NULL,
    "is_delivered" BOOLEAN NOT NULL DEFAULT false,
    "delivered_at" TIMESTAMP(3) NOT NULL,
    "fk_user_id" TEXT NOT NULL,
    "fk_shipping_address_id" TEXT NOT NULL,
    "fk_payment_results_id" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shippingAddress" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shippingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentResults" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "updated_time" TEXT NOT NULL,
    "email_address" TEXT NOT NULL,

    CONSTRAINT "PaymentResults_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_fk_payment_results_id_key" ON "orders"("fk_payment_results_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_fk_order_id_fkey" FOREIGN KEY ("fk_order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_fk_user_id_fkey" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_fk_shipping_address_id_fkey" FOREIGN KEY ("fk_shipping_address_id") REFERENCES "shippingAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_fk_payment_results_id_fkey" FOREIGN KEY ("fk_payment_results_id") REFERENCES "PaymentResults"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
