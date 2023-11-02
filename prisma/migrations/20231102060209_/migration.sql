/*
  Warnings:

  - Made the column `token` on table `warga` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `warga` MODIFY `token` CHAR(5) NOT NULL;
