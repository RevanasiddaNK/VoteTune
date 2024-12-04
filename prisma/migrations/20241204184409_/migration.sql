/*
  Warnings:

  - Added the required column `playedAt` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `upvote` DROP FOREIGN KEY `Upvote_streamId_fkey`;

-- AlterTable
ALTER TABLE `stream` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isPlayed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `playedAt` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `Upvote` ADD CONSTRAINT `Upvote_streamId_fkey` FOREIGN KEY (`streamId`) REFERENCES `Stream`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
