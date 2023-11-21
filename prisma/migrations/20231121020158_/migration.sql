/*
  Warnings:

  - You are about to drop the column `isActive` on the `votingcandidates` table. All the data in the column will be lost.
  - You are about to drop the column `isDone` on the `votingcandidates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `votingcandidates` DROP COLUMN `isActive`,
    DROP COLUMN `isDone`,
    ADD COLUMN `status` ENUM('not_ready', 'ready', 'active', 'done') NOT NULL DEFAULT 'not_ready';
