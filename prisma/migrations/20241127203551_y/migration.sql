/*
  Warnings:

  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,streamId]` on the table `Upvote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `extractedId` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stream` ADD COLUMN `extractedId` VARCHAR(191) NOT NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `role`;

-- CreateIndex
CREATE UNIQUE INDEX `Upvote_userId_streamId_key` ON `Upvote`(`userId`, `streamId`);
