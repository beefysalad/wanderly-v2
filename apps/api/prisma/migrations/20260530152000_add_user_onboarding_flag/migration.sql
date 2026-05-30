-- AlterTable
ALTER TABLE "User" ADD COLUMN "hasCompletedOnboarding" BOOLEAN NOT NULL DEFAULT false;

-- Backfill users who completed the previous onboarding shape before the explicit flag existed.
UPDATE "User"
SET "hasCompletedOnboarding" = true
WHERE "name" IS NOT NULL
  AND cardinality("interests") > 0;
