-- AlterTable
ALTER TABLE `service` ADD COLUMN `created_by` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `professional`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
