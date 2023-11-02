/*
  Warnings:

  - You are about to alter the column `token` on the `warga` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `Char(5)`.

*/
-- AlterTable
ALTER TABLE `warga` MODIFY `token` CHAR(5) NULL;
