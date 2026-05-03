import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { getDb, shopsTable } from "@workspace/db";

const router: IRouter = Router();

/* ────────────────────────────────────────────────────────────
   GET /api/sd   — discover the primary (first) shop
   Used by visitors who don't have a shopId configured yet.
──────────────────────────────────────────────────────────── */
router.get("/sd", async (req, res) => {
  try {
    const db = getDb();
    const rows = await db.select().from(shopsTable).limit(1);
    if (rows.length === 0) {
      res.status(404).json({ error: "No shop configured yet" });
      return;
    }
    res.json({ shopId: rows[0]!.id, data: rows[0]!.data, updatedAt: rows[0]!.updatedAt });
  } catch (err) {
    req.log.error({ err }, "GET /sd failed");
    res.status(503).json({ error: "Database unavailable" });
  }
});

/* ────────────────────────────────────────────────────────────
   GET /api/sd/:shopId   — public read
──────────────────────────────────────────────────────────── */
router.get("/sd/:shopId", async (req, res) => {
  const { shopId } = req.params as { shopId: string };
  try {
    const db = getDb();
    const rows = await db.select().from(shopsTable).where(eq(shopsTable.id, shopId)).limit(1);
    if (rows.length === 0) {
      res.status(404).json({ error: "Shop not found" });
      return;
    }
    res.json({ data: rows[0]!.data, updatedAt: rows[0]!.updatedAt });
  } catch (err) {
    req.log.error({ err }, "GET /sd/:shopId failed");
    res.status(503).json({ error: "Database unavailable" });
  }
});

/* ────────────────────────────────────────────────────────────
   PUT /api/sd/:shopId   — authenticated write / create
   Header: X-Admin-Token: <token>
──────────────────────────────────────────────────────────── */
router.put("/sd/:shopId", async (req, res) => {
  const { shopId } = req.params as { shopId: string };
  const token = (req.headers["x-admin-token"] as string | undefined)?.trim();

  if (!token) {
    res.status(401).json({ error: "X-Admin-Token header required" });
    return;
  }

  const data = req.body as Record<string, unknown>;
  if (!data || typeof data !== "object" || !data["settings"]) {
    res.status(400).json({ error: "Request body must include a valid shop data object" });
    return;
  }

  try {
    const db = getDb();
    const existing = await db.select().from(shopsTable).where(eq(shopsTable.id, shopId)).limit(1);

    if (existing.length === 0) {
      /* ── First-time setup: create the shop ── */
      await db.insert(shopsTable).values({ id: shopId, data, adminToken: token });
      res.status(201).json({ ok: true, created: true });
    } else {
      /* ── Existing shop: verify token ── */
      if (existing[0]!.adminToken !== token) {
        res.status(403).json({ error: "Invalid admin token" });
        return;
      }
      await db
        .update(shopsTable)
        .set({ data, updatedAt: new Date() })
        .where(eq(shopsTable.id, shopId));
      res.json({ ok: true, created: false });
    }
  } catch (err) {
    req.log.error({ err }, "PUT /sd/:shopId failed");
    res.status(503).json({ error: "Database unavailable" });
  }
});

export default router;
