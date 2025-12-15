import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  getAnnouncements,
  createAnnouncement,
  getAnnouncementsBySlug,
} from "../controllers/announcement.controllers";

const router = Router();

// GET /api/announcements/public/:slug - Fetch announcements for a barangay by slug (public)
router.get("/public/:slug", getAnnouncementsBySlug);

// GET /api/announcements - Fetch all announcements for the user's barangay
router.get("/", requireAuth, getAnnouncements);

// POST /api/announcements - Create a new announcement
router.post("/", requireAuth, createAnnouncement);

export default router;
