/*
  Warnings:

  - Made the column `candidateId` on table `votingcandidates` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `votingcandidates` DROP FOREIGN KEY `VotingCandidates_candidateId_fkey`;

-- AlterTable
ALTER TABLE `votingcandidates` MODIFY `candidateId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `VotingCandidates` ADD CONSTRAINT `VotingCandidates_candidateId_fkey` FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
