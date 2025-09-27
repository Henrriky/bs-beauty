/*
  Warnings:

  - A unique constraint covering the columns `[marker]` on the table `notification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `marker` to the `notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_id` to the `notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customer` ADD COLUMN `notification_preference` ENUM('NONE', 'IN_APP', 'EMAIL', 'BOTH') NULL DEFAULT 'NONE';

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `marker` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipient_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `professional` ADD COLUMN `notification_preference` ENUM('NONE', 'IN_APP', 'EMAIL', 'BOTH') NULL DEFAULT 'NONE';

-- CreateIndex
CREATE UNIQUE INDEX `notification_marker_key` ON `notification`(`marker`);

-- CreateIndex
CREATE INDEX `notification_recipient_id_read_at_created_at_idx` ON `notification`(`recipient_id`, `read_at`, `created_at`);
