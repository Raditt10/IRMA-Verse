/*
  Warnings:

  - You are about to drop the column `maxParticipants` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the `registrations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `registrations` DROP FOREIGN KEY `registrations_scheduleId_fkey`;

-- DropForeignKey
ALTER TABLE `registrations` DROP FOREIGN KEY `registrations_userId_fkey`;

-- AlterTable
ALTER TABLE `schedules` DROP COLUMN `maxParticipants`;

-- DropTable
DROP TABLE `registrations`;
