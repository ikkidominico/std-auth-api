/*
  Warnings:

  - The primary key for the `logins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `logins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "logins" DROP CONSTRAINT "logins_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "logins_pkey" PRIMARY KEY ("id");
