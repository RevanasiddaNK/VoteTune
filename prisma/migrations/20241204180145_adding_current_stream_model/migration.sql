-- CreateTable
CREATE TABLE `currentStream` (
    `userId` VARCHAR(191) NOT NULL,
    `streamId` VARCHAR(191) NULL,

    UNIQUE INDEX `currentStream_streamId_key`(`streamId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `currentStream` ADD CONSTRAINT `currentStream_streamId_fkey` FOREIGN KEY (`streamId`) REFERENCES `Stream`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
