-- DropForeignKey
ALTER TABLE `votingcandidates` DROP FOREIGN KEY `VotingCandidates_candidateId_fkey`;

-- AlterTable
ALTER TABLE `votingcandidates` MODIFY `candidateId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `VotingCandidates` ADD CONSTRAINT `VotingCandidates_candidateId_fkey` FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
