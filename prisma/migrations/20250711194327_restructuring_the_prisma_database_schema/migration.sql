/*
  Warnings:

  - The primary key for the `currentstream` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `currentstream` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `stream` table. All the data in the column will be lost.
  - The values [Google] on the enum `User_provider` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[playlistId]` on the table `currentStream` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `playlistId` to the `currentStream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addedById` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Made the column `playlistId` on table `stream` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `upvote` required. This step will fail if there are existing NULL values in that column.
  - Made the column `streamId` on table `upvote` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `stream` DROP FOREIGN KEY `Stream_playlistId_fkey`;

-- DropForeignKey
ALTER TABLE `stream` DROP FOREIGN KEY `Stream_userId_fkey`;

-- DropForeignKey
ALTER TABLE `upvote` DROP FOREIGN KEY `Upvote_streamId_fkey`;

-- DropForeignKey
ALTER TABLE `upvote` DROP FOREIGN KEY `Upvote_userId_fkey`;

-- DropIndex
DROP INDEX `Stream_userId_fkey` ON `stream`;

-- DropIndex
DROP INDEX `Upvote_streamId_fkey` ON `upvote`;

-- AlterTable
ALTER TABLE `currentstream` DROP PRIMARY KEY,
    DROP COLUMN `userId`,
    ADD COLUMN `playlistId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`playlistId`);

-- AlterTable
ALTER TABLE `playlist` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `userId` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `stream` DROP COLUMN `userId`,
    ADD COLUMN `addedById` VARCHAR(191) NOT NULL,
    MODIFY `playlistId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `upvote` MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `streamId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `provider` ENUM('google') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `currentStream_playlistId_key` ON `currentStream`(`playlistId`);

-- CreateIndex
CREATE INDEX `Playlist_name_idx` ON `Playlist`(`name`);

-- CreateIndex
CREATE INDEX `Stream_addedById_idx` ON `Stream`(`addedById`);

-- CreateIndex
CREATE INDEX `Stream_createdAt_idx` ON `Stream`(`createdAt`);

-- AddForeignKey
ALTER TABLE `Stream` ADD CONSTRAINT `Stream_playlistId_fkey` FOREIGN KEY (`playlistId`) REFERENCES `Playlist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stream` ADD CONSTRAINT `Stream_addedById_fkey` FOREIGN KEY (`addedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Playlist` ADD CONSTRAINT `Playlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `currentStream` ADD CONSTRAINT `currentStream_playlistId_fkey` FOREIGN KEY (`playlistId`) REFERENCES `Playlist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Upvote` ADD CONSTRAINT `Upvote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Upvote` ADD CONSTRAINT `Upvote_streamId_fkey` FOREIGN KEY (`streamId`) REFERENCES `Stream`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `stream` RENAME INDEX `Stream_playlistId_fkey` TO `Stream_playlistId_idx`;
