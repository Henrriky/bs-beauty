-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `allows_image_use` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `customer` ADD COLUMN `always_allow_image_use` BOOLEAN NOT NULL DEFAULT false;
