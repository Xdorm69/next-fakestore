/*
  Warnings:

  - Added the required column `quantity` to the `BuyHistory` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BuyHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL DEFAULT 'CASH',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_BuyHistory" ("address", "createdAt", "email", "id", "name", "paymentMethod", "paymentStatus", "price", "productId", "userId") SELECT "address", "createdAt", "email", "id", "name", "paymentMethod", "paymentStatus", "price", "productId", "userId" FROM "BuyHistory";
DROP TABLE "BuyHistory";
ALTER TABLE "new_BuyHistory" RENAME TO "BuyHistory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
