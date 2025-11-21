-- CreateTable
CREATE TABLE "Link" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "targetUrl" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "lastClicked" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
