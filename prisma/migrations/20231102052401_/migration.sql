/*
  Warnings:

  - You are about to drop the column `candidateVotedWargaId` on the `candidate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `candidate` DROP COLUMN `candidateVotedWargaId`;

-- AlterTable
ALTER TABLE `warga` ADD COLUMN `token` VARCHAR(500) NULL;
