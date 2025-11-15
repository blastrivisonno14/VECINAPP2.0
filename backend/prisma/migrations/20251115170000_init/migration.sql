-- Prisma initial migration generated manually to match schema.prisma
-- Enums
CREATE TYPE "Role" AS ENUM ('user','commerce','admin');
CREATE TYPE "DiscountType" AS ENUM ('percent','amount','2x1','combo','happyhour');
CREATE TYPE "DayOfWeek" AS ENUM ('monday','tuesday','wednesday','thursday','friday','saturday','sunday');

-- Tables
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'user',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "commerces" (
  "id" SERIAL PRIMARY KEY,
  "ownerId" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "lat" DOUBLE PRECISION,
  "lng" DOUBLE PRECISION,
  "category" TEXT,
  "logoUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "commerces_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "commerces_ownerId_idx" ON "commerces" ("ownerId");

CREATE TABLE "promotions" (
  "id" SERIAL PRIMARY KEY,
  "commerceId" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "imageUrl" TEXT,
  "discountType" "DiscountType" NOT NULL,
  "discountValue" DOUBLE PRECISION,
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "daysOfWeek" "DayOfWeek"[] NOT NULL DEFAULT '{}',
  "maxCoupons" INTEGER,
  "remainingCoupons" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "promotions_commerceId_fkey" FOREIGN KEY ("commerceId") REFERENCES "commerces"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "promotions_commerceId_idx" ON "promotions" ("commerceId");
CREATE INDEX "promotions_isActive_start_end_idx" ON "promotions" ("isActive", "startDate", "endDate");

CREATE TABLE "coupons" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER,
  "promotionId" INTEGER NOT NULL,
  "qrCode" TEXT NOT NULL UNIQUE,
  "redeemedAt" TIMESTAMP(3),
  CONSTRAINT "coupons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "coupons_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "coupons_promotionId_idx" ON "coupons" ("promotionId");
CREATE INDEX "coupons_userId_idx" ON "coupons" ("userId");

CREATE TABLE "refresh_tokens" (
  "id" SERIAL PRIMARY KEY,
  "token" TEXT NOT NULL UNIQUE,
  "userId" INTEGER NOT NULL,
  "revoked" BOOLEAN NOT NULL DEFAULT FALSE,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens" ("userId");
