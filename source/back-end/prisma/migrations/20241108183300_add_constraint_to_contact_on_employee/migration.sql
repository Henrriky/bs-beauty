/*
  Warnings:

  - A unique constraint covering the columns `[contact]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `is_offering` to the `offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `offer` ADD COLUMN `is_offering` BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `employee_contact_key` ON `employee`(`contact`);
