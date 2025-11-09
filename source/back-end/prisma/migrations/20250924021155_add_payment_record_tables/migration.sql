-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `payment_record_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `payment_record` (
    `id` VARCHAR(191) NOT NULL,
    `total_value` DECIMAL(10, 2) NOT NULL,
    `payment_method` VARCHAR(191) NOT NULL,
    `customer_id` VARCHAR(191) NOT NULL,
    `professional_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_item` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `discount` DECIMAL(4, 3) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `payment_record_id` VARCHAR(191) NOT NULL,
    `offer_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_payment_record_id_fkey` FOREIGN KEY (`payment_record_id`) REFERENCES `payment_record`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_record` ADD CONSTRAINT `payment_record_professional_id_fkey` FOREIGN KEY (`professional_id`) REFERENCES `professional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_record` ADD CONSTRAINT `payment_record_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_item` ADD CONSTRAINT `payment_item_payment_record_id_fkey` FOREIGN KEY (`payment_record_id`) REFERENCES `payment_record`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_item` ADD CONSTRAINT `payment_item_offer_id_fkey` FOREIGN KEY (`offer_id`) REFERENCES `offer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
