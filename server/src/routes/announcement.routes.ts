import { Router } from "express";
import { requireRole } from "../middlewares/auth.middleware";
import {
  getAnnouncements,
  createAnnouncement,
  getAnnouncementsBySlug,
} from "../controllers/announcement.controllers";

const router = Router();

// GET /api/announcements/public/:slug - Fetch announcements for a barangay by slug (public)
router.get("/public/:slug", getAnnouncementsBySlug);

// GET /api/announcements - Fetch all announcements for the user's barangay (SK Official only)
router.get("/", requireRole([1]), getAnnouncements);

// POST /api/announcements - Create a new announcement (SK Official only)
router.post("/", requireRole([1]), createAnnouncement);

export default router;
