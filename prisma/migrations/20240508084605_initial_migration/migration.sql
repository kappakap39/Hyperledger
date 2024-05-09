/*
  Warnings:

  - You are about to drop the column `Hash` on the `Generate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Generate" DROP COLUMN "Hash",
ADD COLUMN     "encrypt_hash" TEXT;
