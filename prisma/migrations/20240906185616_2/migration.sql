/*
  Warnings:

  - You are about to alter the column `lastReadAt` on the `Album` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Album" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "imageBase64" TEXT NOT NULL,
    "lastReadAt" INTEGER NOT NULL
);
INSERT INTO "new_Album" ("id", "imageBase64", "lastReadAt", "name") SELECT "id", "imageBase64", "lastReadAt", "name" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
