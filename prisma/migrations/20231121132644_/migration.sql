/*
  Warnings:

  - You are about to drop the column `status` on the `votingcandidates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `voting` ADD COLUMN `status` ENUM('not_ready', 'ready', 'active', 'done') NOT NULL DEFAULT 'not_ready';

-- AlterTable
ALTER TABLE `votingcandidates` DROP COLUMN `status`;
