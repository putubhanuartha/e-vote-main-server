/*
  Warnings:

  - You are about to drop the `candidatevoted` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `Warga` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `candidatevoted` DROP FOREIGN KEY `CandidateVoted_candidateId_fkey`;

-- DropForeignKey
ALTER TABLE `candidatevoted` DROP FOREIGN KEY `CandidateVoted_wargaId_fkey`;

-- AlterTable
ALTER TABLE `candidate` ADD COLUMN `candidateVotedWargaId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `warga` ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `registered` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `candidatevoted`;

-- CreateTable
CREATE TABLE `CandidateVotedTransaction` (
    `wargaId` VARCHAR(191) NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `votingCandidatesId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CandidateVotedTransaction_wargaId_key`(`wargaId`),
    PRIMARY KEY (`wargaId`, `votingCandidatesId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VotingCandidates` (
    `id` VARCHAR(191) NOT NULL,
    `votingId` VARCHAR(191) NOT NULL,
    `candidateId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `VotingCandidates_candidateId_key`(`candidateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Voting` (
    `id` VARCHAR(191) NOT NULL,
    `dateStart` DATETIME(3) NOT NULL,
    `timeStart` DATETIME(3) NOT NULL,
    `timeEnd` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `jenisPilihan` ENUM('rt', 'rw') NOT NULL DEFAULT 'rt',
    `kecamatan` VARCHAR(191) NOT NULL,
    `kelurahan` VARCHAR(191) NOT NULL,
    `rw` INTEGER NOT NULL,
    `rt` INTEGER NULL,
    `candidateVotedWargaId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CandidateVotedTransaction` ADD CONSTRAINT `CandidateVotedTransaction_wargaId_fkey` FOREIGN KEY (`wargaId`) REFERENCES `Warga`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateVotedTransaction` ADD CONSTRAINT `CandidateVotedTransaction_votingCandidatesId_fkey` FOREIGN KEY (`votingCandidatesId`) REFERENCES `VotingCandidates`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VotingCandidates` ADD CONSTRAINT `VotingCandidates_votingId_fkey` FOREIGN KEY (`votingId`) REFERENCES `Voting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VotingCandidates` ADD CONSTRAINT `VotingCandidates_candidateId_fkey` FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
