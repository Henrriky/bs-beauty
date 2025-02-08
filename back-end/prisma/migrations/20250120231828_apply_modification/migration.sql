-- DropForeignKey
ALTER TABLE `appointment_service` DROP FOREIGN KEY `appointment_service_service_id_fkey`;

-- AddForeignKey
ALTER TABLE `appointment_service` ADD CONSTRAINT `appointment_service_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `offer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
