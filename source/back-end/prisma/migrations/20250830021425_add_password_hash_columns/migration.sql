-- AlterTable
ALTER TABLE `customer` ADD COLUMN `password_hash` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `password_hash` VARCHAR(191) NULL;
