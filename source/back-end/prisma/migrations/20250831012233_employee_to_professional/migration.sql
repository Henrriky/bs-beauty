/*
  Warnings:

  - The values [EMPLOYEE] on the enum `professional_user_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `employee_id` on the `offer` table. All the data in the column will be lost.
  - You are about to drop the column `employee_id` on the `shift` table. All the data in the column will be lost.
  - You are about to drop the `employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employee_role` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `professional_id` to the `offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professional_id` to the `shift` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `employee_role` DROP FOREIGN KEY `employee_role_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `employee_role` DROP FOREIGN KEY `employee_role_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `offer` DROP FOREIGN KEY `offer_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `shift` DROP FOREIGN KEY `shift_employee_id_fkey`;

-- AlterTable
ALTER TABLE `customer` MODIFY `user_type` ENUM('MANAGER', 'CUSTOMER', 'PROFESSIONAL') NOT NULL DEFAULT 'CUSTOMER';

-- AlterTable
ALTER TABLE `offer` DROP COLUMN `employee_id`,
    ADD COLUMN `professional_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `shift` DROP COLUMN `employee_id`,
    ADD COLUMN `professional_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `employee`;

-- DropTable
DROP TABLE `employee_role`;

-- CreateTable
CREATE TABLE `professional` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL DEFAULT 'Usuário',
    `email` VARCHAR(191) NOT NULL,
    `google_id` VARCHAR(191) NULL,
    `register_completed` BOOLEAN NOT NULL DEFAULT false,
    `social_media` JSON NULL,
    `contact` VARCHAR(191) NULL,
    `specialization` VARCHAR(191) NULL,
    `profile_photo_url` VARCHAR(191) NULL,
    `user_type` ENUM('MANAGER', 'CUSTOMER', 'PROFESSIONAL') NOT NULL DEFAULT 'PROFESSIONAL',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `professional_email_key`(`email`),
    UNIQUE INDEX `professional_google_id_key`(`google_id`),
    UNIQUE INDEX `professional_contact_key`(`contact`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professional_role` (
    `id` VARCHAR(191) NOT NULL,
    `professional_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `offer` ADD CONSTRAINT `offer_professional_id_fkey` FOREIGN KEY (`professional_id`) REFERENCES `professional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shift` ADD CONSTRAINT `shift_professional_id_fkey` FOREIGN KEY (`professional_id`) REFERENCES `professional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professional_role` ADD CONSTRAINT `professional_role_professional_id_fkey` FOREIGN KEY (`professional_id`) REFERENCES `professional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professional_role` ADD CONSTRAINT `professional_role_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
