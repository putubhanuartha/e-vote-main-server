/*
  Warnings:

  - You are about to drop the column `dateStart` on the `voting` table. All the data in the column will be lost.
  - You are about to drop the column `timeEnd` on the `voting` table. All the data in the column will be lost.
  - You are about to drop the column `timeStart` on the `voting` table. All the data in the column will be lost.
  - You are about to alter the column `rt` on the `voting` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.
  - Added the required column `epochtimeEnd` to the `Voting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `epochtimeStart` to the `Voting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `voting` DROP COLUMN `dateStart`,
    DROP COLUMN `timeEnd`,
    DROP COLUMN `timeStart`,
    ADD COLUMN `epochtimeEnd` BIGINT NOT NULL,
    ADD COLUMN `epochtimeStart` BIGINT NOT NULL,
    MODIFY `rt` INTEGER UNSIGNED NULL;
