-- AlterTable
ALTER TABLE `votingcandidates` ADD COLUMN `isDone` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `isActive` BOOLEAN NOT NULL DEFAULT false;
