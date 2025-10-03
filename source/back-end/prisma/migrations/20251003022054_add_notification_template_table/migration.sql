-- CreateTable
CREATE TABLE `notification_template` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `variables` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `notification_template_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `notification_template`
  (`id`, `key`, `name`, `description`, `title`, `body`, `is_active`, `variables`, `created_at`, `updated_at`)
VALUES
  (
    UUID(),
    'BIRTHDAY',
    'Mensagem de aniversário',
    'Modelo de mensagem automática usado para parabenizar aniversariantes do dia.',
    'Feliz aniversário, {nome}! 🎉',
    'Oi, {nome}! Hoje você completa {idade} anos. A {empresa} te deseja um dia incrível!',
    TRUE,
    JSON_ARRAY(
        'nome',
        'idade',
        'empresa',
        'data_aniversario'
    ),
    NOW(3),
    NOW(3)
  );
