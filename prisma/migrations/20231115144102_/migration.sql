-- AlterTable
ALTER TABLE `voting` MODIFY `dateStart` DATE NOT NULL,
    MODIFY `timeStart` TIME NOT NULL,
    MODIFY `timeEnd` TIME NOT NULL;
