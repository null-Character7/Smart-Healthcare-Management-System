/*
  Warnings:

  - Added the required column `confirmed` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confirmed` to the `Prescription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "confirmed" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Prescription" ADD COLUMN     "confirmed" BOOLEAN NOT NULL;
