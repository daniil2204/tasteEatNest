/*
  Warnings:

  - You are about to drop the column `bookHours` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "bookHours",
ADD COLUMN     "bookHour" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hourCount" INTEGER NOT NULL DEFAULT 0;
