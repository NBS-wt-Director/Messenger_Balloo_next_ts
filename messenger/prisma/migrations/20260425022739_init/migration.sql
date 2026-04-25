-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" DATETIME,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FamilyRelation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "relatedUserId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FamilyRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FamilyRelation_relatedUserId_fkey" FOREIGN KEY ("relatedUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "description" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isSystemChat" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "ChatMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReadMessageId" TEXT,
    CONSTRAINT "ChatMember_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chatId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "thumbnailUrl" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "replyToId" TEXT,
    "readBy" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Message" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MessageReaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messageId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MessageReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "chatId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "isPermanent" BOOLEAN NOT NULL DEFAULT false,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "pointsReward" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Invitation_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Invitation_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvitationUse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invitationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "usedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InvitationUse_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InvitationUse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "avatar" TEXT,
    "chatId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Contact_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "icon" TEXT,
    "badge" TEXT,
    "data" JSONB,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    CONSTRAINT "Report_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Report_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Report_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatFavorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatFavorite_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatPinned" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatPinned_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatPinned_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "adminNote" TEXT,
    "plannedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL,
    CONSTRAINT "Feature_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeatureVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "featureId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FeatureVote_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FeatureVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sections" JSONB,
    "metadata" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Page_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "FamilyRelation_userId_idx" ON "FamilyRelation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyRelation_userId_relatedUserId_type_key" ON "FamilyRelation"("userId", "relatedUserId", "type");

-- CreateIndex
CREATE INDEX "Chat_type_idx" ON "Chat"("type");

-- CreateIndex
CREATE INDEX "Chat_createdAt_idx" ON "Chat"("createdAt");

-- CreateIndex
CREATE INDEX "Chat_updatedAt_idx" ON "Chat"("updatedAt");

-- CreateIndex
CREATE INDEX "ChatMember_chatId_idx" ON "ChatMember"("chatId");

-- CreateIndex
CREATE INDEX "ChatMember_userId_idx" ON "ChatMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatMember_chatId_userId_key" ON "ChatMember"("chatId", "userId");

-- CreateIndex
CREATE INDEX "Message_chatId_idx" ON "Message"("chatId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- CreateIndex
CREATE INDEX "MessageReaction_messageId_idx" ON "MessageReaction"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "MessageReaction_messageId_emoji_userId_key" ON "MessageReaction"("messageId", "emoji", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_code_key" ON "Invitation"("code");

-- CreateIndex
CREATE INDEX "Invitation_code_idx" ON "Invitation"("code");

-- CreateIndex
CREATE INDEX "Invitation_createdBy_idx" ON "Invitation"("createdBy");

-- CreateIndex
CREATE INDEX "Invitation_expiresAt_idx" ON "Invitation"("expiresAt");

-- CreateIndex
CREATE INDEX "InvitationUse_invitationId_idx" ON "InvitationUse"("invitationId");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationUse_invitationId_userId_key" ON "InvitationUse"("invitationId", "userId");

-- CreateIndex
CREATE INDEX "Contact_userId_idx" ON "Contact"("userId");

-- CreateIndex
CREATE INDEX "Contact_phone_idx" ON "Contact"("phone");

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_timestamp_idx" ON "Notification"("timestamp");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Report_targetType_idx" ON "Report"("targetType");

-- CreateIndex
CREATE INDEX "Report_targetId_idx" ON "Report"("targetId");

-- CreateIndex
CREATE INDEX "Report_reportedBy_idx" ON "Report"("reportedBy");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_createdAt_idx" ON "Report"("createdAt");

-- CreateIndex
CREATE INDEX "ChatFavorite_userId_idx" ON "ChatFavorite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatFavorite_chatId_userId_key" ON "ChatFavorite"("chatId", "userId");

-- CreateIndex
CREATE INDEX "ChatPinned_userId_idx" ON "ChatPinned"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatPinned_chatId_userId_key" ON "ChatPinned"("chatId", "userId");

-- CreateIndex
CREATE INDEX "Feature_status_idx" ON "Feature"("status");

-- CreateIndex
CREATE INDEX "Feature_category_idx" ON "Feature"("category");

-- CreateIndex
CREATE INDEX "Feature_createdAt_idx" ON "Feature"("createdAt");

-- CreateIndex
CREATE INDEX "FeatureVote_featureId_idx" ON "FeatureVote"("featureId");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureVote_featureId_userId_key" ON "FeatureVote"("featureId", "userId");

-- CreateIndex
CREATE INDEX "Page_isActive_idx" ON "Page"("isActive");
