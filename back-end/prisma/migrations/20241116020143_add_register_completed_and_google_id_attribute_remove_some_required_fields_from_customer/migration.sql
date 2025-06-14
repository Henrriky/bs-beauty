/*
  Warnings:

  - You are about to drop the column `password_hash` on the `employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[google_id]` on the table `customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[google_id]` on the table `employee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `customer` ADD COLUMN `google_id` VARCHAR(191) NULL,
    ADD COLUMN `register_completed` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `birthdate` DATETIME(3) NULL,
    MODIFY `phone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `password_hash`,
    ADD COLUMN `google_id` VARCHAR(191) NULL,
    ADD COLUMN `register_completed` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `customer_google_id_key` ON `customer`(`google_id`);

-- CreateIndex
CREATE UNIQUE INDEX `employee_google_id_key` ON `employee`(`google_id`);
