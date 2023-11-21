/*
  Warnings:

  - You are about to alter the column `epochtimeEnd` on the `voting` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `epochtimeStart` on the `voting` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `voting` MODIFY `epochtimeEnd` INTEGER NOT NULL,
    MODIFY `epochtimeStart` INTEGER NOT NULL;
