/*
  Warnings:

  - You are about to drop the column `appointment_id` on the `notification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[marker]` on the table `notification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `marker` to the `notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientType` to the `notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_id` to the `notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_appointment_id_fkey`;

-- DropIndex
DROP INDEX `notification_appointment_id_fkey` ON `notification`;

-- AlterTable
ALTER TABLE `customer` ADD COLUMN `notification_preference` ENUM('NONE', 'IN_APP', 'ALL') NULL DEFAULT 'NONE';

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `appointment_id`,
    ADD COLUMN `marker` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipientType` ENUM('MANAGER', 'CUSTOMER', 'PROFESSIONAL') NOT NULL,
    ADD COLUMN `recipient_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` ENUM('SYSTEM', 'APPOINTMENT', 'SERVICE', 'PROMO') NOT NULL DEFAULT 'SYSTEM',
    MODIFY `message` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `professional` ADD COLUMN `notification_preference` ENUM('NONE', 'IN_APP', 'ALL') NULL DEFAULT 'NONE';

-- CreateIndex
CREATE UNIQUE INDEX `notification_marker_key` ON `notification`(`marker`);

-- CreateIndex
CREATE INDEX `notification_recipient_id_read_at_created_at_idx` ON `notification`(`recipient_id`, `read_at`, `created_at`);
