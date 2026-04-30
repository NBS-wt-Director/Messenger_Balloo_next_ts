-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationCode" TEXT,
    "emailVerificationExpiry" INTEGER,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatar" TEXT,
    "fullName" TEXT,
    "birthDate" INTEGER,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "adminRoles" JSONB NOT NULL,
    "adminSince" INTEGER,
    "publicKey" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpiry" INTEGER,
    "yandexDiskConnected" BOOLEAN NOT NULL DEFAULT false,
    "yandexDiskAccessToken" TEXT,
    "yandexDiskRefreshToken" TEXT,
    "phone" TEXT,
    "bio" TEXT,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" DATETIME,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("adminRoles", "adminSince", "avatar", "birthDate", "createdAt", "displayName", "email", "emailVerificationCode", "emailVerificationExpiry", "emailVerified", "fullName", "id", "isAdmin", "isOnline", "isSuperAdmin", "lastSeen", "passwordHash", "passwordResetExpiry", "passwordResetToken", "publicKey", "status", "updatedAt", "yandexDiskAccessToken", "yandexDiskConnected", "yandexDiskRefreshToken") SELECT "adminRoles", "adminSince", "avatar", "birthDate", "createdAt", "displayName", "email", "emailVerificationCode", "emailVerificationExpiry", "emailVerified", "fullName", "id", "isAdmin", "isOnline", "isSuperAdmin", "lastSeen", "passwordHash", "passwordResetExpiry", "passwordResetToken", "publicKey", "status", "updatedAt", "yandexDiskAccessToken", "yandexDiskConnected", "yandexDiskRefreshToken" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
