-- DropForeignKey
ALTER TABLE `shift` DROP FOREIGN KEY `shift_employee_id_fkey`;

-- AddForeignKey
ALTER TABLE `shift` ADD CONSTRAINT `shift_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
