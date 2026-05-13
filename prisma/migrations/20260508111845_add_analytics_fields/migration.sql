-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteName" TEXT NOT NULL DEFAULT 'GoGMGo',
    "defaultSeoTitle" TEXT NOT NULL DEFAULT 'GoGMGo — The Restaurant Operating System',
    "defaultSeoDescription" TEXT NOT NULL DEFAULT 'POS, procurement, HR, analytics and online ordering — one connected system.',
    "hubspotPortalId" TEXT NOT NULL DEFAULT '',
    "hubspotFormId" TEXT NOT NULL DEFAULT '',
    "hubspotTrackingScript" TEXT NOT NULL DEFAULT '',
    "whatsappNumber" TEXT NOT NULL DEFAULT '',
    "supportEmail" TEXT NOT NULL DEFAULT '',
    "googleAnalyticsId" TEXT NOT NULL DEFAULT '',
    "googleTagManagerId" TEXT NOT NULL DEFAULT '',
    "metaPixelId" TEXT NOT NULL DEFAULT '',
    "clarityProjectId" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_SiteSettings" ("defaultSeoDescription", "defaultSeoTitle", "hubspotFormId", "hubspotPortalId", "hubspotTrackingScript", "id", "siteName", "supportEmail", "whatsappNumber") SELECT "defaultSeoDescription", "defaultSeoTitle", "hubspotFormId", "hubspotPortalId", "hubspotTrackingScript", "id", "siteName", "supportEmail", "whatsappNumber" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
