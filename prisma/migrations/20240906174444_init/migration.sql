-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "imageBase64" TEXT NOT NULL,
    "lastReadAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uri" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "albumId" TEXT NOT NULL,
    CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Track_uri_key" ON "Track"("uri");

-- CreateIndex
CREATE INDEX "Track_albumId_idx" ON "Track"("albumId");
