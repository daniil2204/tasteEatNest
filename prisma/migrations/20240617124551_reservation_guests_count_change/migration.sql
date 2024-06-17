/*
  Warnings:

  - You are about to drop the column `countOfQuests` on the `Table` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "bookHour" DROP DEFAULT,
ALTER COLUMN "hourCount" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "countOfQuests",
ADD COLUMN     "countOfGuests" INTEGER NOT NULL DEFAULT 0;
