-- AlterTable
ALTER TABLE `stream` ADD COLUMN `bigThumbnail` VARCHAR(191) NOT NULL DEFAULT 'https://img.lovepik.com/photo/45014/5040.jpg_wh860.jpg',
    ADD COLUMN `smallThumbnail` VARCHAR(191) NOT NULL DEFAULT 'https://img.freepik.com/premium-photo/3d-youtube-icon-neon-black-wall_289054-64.jpg',
    ADD COLUMN `title` VARCHAR(191) NOT NULL DEFAULT 'Title not found';
