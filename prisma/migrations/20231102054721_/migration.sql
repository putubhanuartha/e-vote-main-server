/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Warga` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `Warga` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Warga_email_key` ON `Warga`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Warga_token_key` ON `Warga`(`token`);
