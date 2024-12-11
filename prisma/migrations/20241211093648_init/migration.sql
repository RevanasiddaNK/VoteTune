-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `provider` ENUM('Google') NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Stream` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT 'Title not found',
    `bigThumbnail` VARCHAR(191) NOT NULL DEFAULT 'https://img.lovepik.com/photo/45014/5040.jpg_wh860.jpg',
    `smallThumbnail` VARCHAR(191) NOT NULL DEFAULT 'https://img.freepik.com/premium-photo/3d-youtube-icon-neon-black-wall_289054-64.jpg',
    `url` VARCHAR(191) NOT NULL,
    `isPlayed` BOOLEAN NOT NULL DEFAULT false,
    `playedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `extractedId` VARCHAR(191) NOT NULL,
    `type` ENUM('Youtube', 'Spotify') NOT NULL,
    `userId` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `currentStream` (
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL DEFAULT 'No Video Found',
    `url` VARCHAR(191) NOT NULL DEFAULT 'https://www.youtube.com/watch?v=87JIOAX3njM',
    `bigThumbnail` VARCHAR(191) NOT NULL DEFAULT 'https://i.ytimg.com/vi/P1fIdFRnfqw/maxresdefault.jpg',
    `smallThumbnail` VARCHAR(191) NOT NULL DEFAULT 'https://i.ytimg.com/vi/P1fIdFRnfqw/maxresdefault.jpg',
    `extractedId` VARCHAR(191) NOT NULL DEFAULT '87JIOAX3njM',

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Upvote` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `streamId` VARCHAR(191) NULL,

    UNIQUE INDEX `Upvote_userId_streamId_key`(`userId`, `streamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Stream` ADD CONSTRAINT `Stream_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Upvote` ADD CONSTRAINT `Upvote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Upvote` ADD CONSTRAINT `Upvote_streamId_fkey` FOREIGN KEY (`streamId`) REFERENCES `Stream`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
