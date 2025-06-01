/*
  Warnings:

  - You are about to drop the column `role` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `profilePhotoUrl` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `employee_id` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the `appointment_service` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `appointment_date` to the `appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_id` to the `appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appointment_id` to the `notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `appointment_service` DROP FOREIGN KEY `appointment_service_appointment_id_fkey`;

-- DropForeignKey
ALTER TABLE `appointment_service` DROP FOREIGN KEY `appointment_service_service_id_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_employee_id_fkey`;

-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `appointment_date` DATETIME(3) NOT NULL,
    ADD COLUMN `service_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `customer` DROP COLUMN `role`,
    ADD COLUMN `referral_count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `referrer_id` VARCHAR(191) NULL,
    ADD COLUMN `user_type` ENUM('MANAGER', 'CUSTOMER', 'EMPLOYEE') NOT NULL DEFAULT 'CUSTOMER';

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `profilePhotoUrl`,
    DROP COLUMN `role`,
    ADD COLUMN `profile_photo_url` VARCHAR(191) NULL,
    ADD COLUMN `user_type` ENUM('MANAGER', 'CUSTOMER', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE';

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `content`,
    DROP COLUMN `customer_id`,
    DROP COLUMN `employee_id`,
    DROP COLUMN `title`,
    ADD COLUMN `appointment_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `message` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `appointment_service`;

-- CreateTable
CREATE TABLE `Rating` (
    `id` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 1,
    `comment` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `appointment_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Rating_appointment_id_key`(`appointment_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_role` (
    `id` VARCHAR(191) NOT NULL,
    `employee_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission` (
    `id` VARCHAR(191) NOT NULL,
    `screen` VARCHAR(191) NOT NULL,
    `action` ENUM('CREATE', 'READ', 'UPDATE', 'DELETE') NOT NULL,
    `description` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permission` (
    `id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `permission_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customer` ADD CONSTRAINT `customer_referrer_id_fkey` FOREIGN KEY (`referrer_id`) REFERENCES `customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointment` ADD CONSTRAINT `appointment_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `offer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_appointment_id_fkey` FOREIGN KEY (`appointment_id`) REFERENCES `appointment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_appointment_id_fkey` FOREIGN KEY (`appointment_id`) REFERENCES `appointment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_role` ADD CONSTRAINT `employee_role_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_role` ADD CONSTRAINT `employee_role_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
