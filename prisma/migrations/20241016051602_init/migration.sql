/*
  Warnings:

  - You are about to drop the column `prescribedBy` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the `MedicalRecord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_patientId_fkey";

-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "prescribedBy";

-- DropTable
DROP TABLE "MedicalRecord";
