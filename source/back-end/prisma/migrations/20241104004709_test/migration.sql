/*
  Warnings:

  - You are about to drop the column `appointmentId` on the `appointment_service` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `appointment_service` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `notification` table. All the data in the column will be lost.
  - Added the required column `appointment_id` to the `appointment_service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_id` to the `appointment_service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `appointment_service` DROP FOREIGN KEY `appointment_service_appointmentId_fkey`;

-- DropForeignKey
ALTER TABLE `appointment_service` DROP FOREIGN KEY `appointment_service_serviceId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_employeeId_fkey`;

-- AlterTable
ALTER TABLE `appointment_service` DROP COLUMN `appointmentId`,
    DROP COLUMN `serviceId`,
    ADD COLUMN `appointment_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `service_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `employee` ADD COLUMN `contact` VARCHAR(191) NULL,
    ADD COLUMN `social_media` JSON NULL;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `customerId`,
    DROP COLUMN `employeeId`,
    ADD COLUMN `customer_id` VARCHAR(191) NULL,
    ADD COLUMN `employee_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `appointment_service` ADD CONSTRAINT `appointment_service_appointment_id_fkey` FOREIGN KEY (`appointment_id`) REFERENCES `appointment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointment_service` ADD CONSTRAINT `appointment_service_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
