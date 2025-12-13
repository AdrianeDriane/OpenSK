import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  getAnnouncements,
  createAnnouncement,
} from "../controllers/announcement.controllers";

const router = Router();

// GET /api/announcements - Fetch all announcements for the user's barangay
router.get("/", requireAuth, getAnnouncements);

// POST /api/announcements - Create a new announcement
router.post("/", requireAuth, createAnnouncement);

export default router;
