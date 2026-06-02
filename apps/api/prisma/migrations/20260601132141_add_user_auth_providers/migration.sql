-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'APPLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authProviders" "AuthProvider"[] DEFAULT ARRAY[]::"AuthProvider"[];
