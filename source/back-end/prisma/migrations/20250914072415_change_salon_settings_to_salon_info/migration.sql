/*
  Warnings:

  - You are about to drop the `salon_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `salon_settings`;

-- CreateTable
CREATE TABLE `salon_info` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `name` VARCHAR(191) NOT NULL,
    `opening_hours` JSON NULL,
    `salonAddress` VARCHAR(191) NULL,
    `salon_email` VARCHAR(191) NULL,
    `salon_phone_number` VARCHAR(191) NULL,
    `minimum_advance_time` INTEGER NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
