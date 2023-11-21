/*
  Warnings:

  - A unique constraint covering the columns `[votingId]` on the table `VotingCandidates` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[votingId,candidateId]` on the table `VotingCandidates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isActive` to the `VotingCandidates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `votingcandidates` ADD COLUMN `isActive` BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `VotingCandidates_votingId_key` ON `VotingCandidates`(`votingId`);

-- CreateIndex
CREATE UNIQUE INDEX `VotingCandidates_votingId_candidateId_key` ON `VotingCandidates`(`votingId`, `candidateId`);
