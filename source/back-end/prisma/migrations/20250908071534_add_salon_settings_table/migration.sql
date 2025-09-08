-- CreateTable
CREATE TABLE `salon_settings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `name` VARCHAR(191) NOT NULL,
    `opening_hours` JSON NULL,
    `address` VARCHAR(191) NULL,
    `contact_info` JSON NULL,
    `scheduling_window` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
