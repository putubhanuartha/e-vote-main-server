/*
  Warnings:

  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_userId_fkey`;

-- DropTable
DROP TABLE `post`;

-- DropTable
DROP TABLE `profile`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(500) NOT NULL,

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Warga` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `password` VARCHAR(500) NOT NULL,
    `nik` CHAR(16) NOT NULL,

    UNIQUE INDEX `Warga_nama_key`(`nama`),
    UNIQUE INDEX `Warga_nik_key`(`nik`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Candidate` (
    `id` VARCHAR(191) NOT NULL,
    `wargaId` VARCHAR(191) NOT NULL,
    `visi` VARCHAR(191) NULL,
    `misi` LONGTEXT NULL,
    `photoUrl` TEXT NOT NULL,

    UNIQUE INDEX `Candidate_wargaId_key`(`wargaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidateVoted` (
    `candidateId` VARCHAR(191) NOT NULL,
    `wargaId` VARCHAR(191) NOT NULL,
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CandidateVoted_candidateId_key`(`candidateId`),
    UNIQUE INDEX `CandidateVoted_wargaId_key`(`wargaId`),
    UNIQUE INDEX `CandidateVoted_candidateId_wargaId_key`(`candidateId`, `wargaId`),
    PRIMARY KEY (`candidateId`, `wargaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_wargaId_fkey` FOREIGN KEY (`wargaId`) REFERENCES `Warga`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateVoted` ADD CONSTRAINT `CandidateVoted_candidateId_fkey` FOREIGN KEY (`candidateId`) REFERENCES `Candidate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CandidateVoted` ADD CONSTRAINT `CandidateVoted_wargaId_fkey` FOREIGN KEY (`wargaId`) REFERENCES `Warga`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
