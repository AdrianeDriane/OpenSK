import { Router } from "express";
import {
  createInquiry,
  getInquiries,
  resolveInquiry,
} from "../controllers/inquiry.controllers";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/inquiries - Get list of inquiries for SK Official's barangay (protected)
router.get("/", requireAuth, getInquiries);

// PATCH /api/inquiries/:id/resolve - Mark inquiry as resolved (protected)
router.patch("/:id/resolve", requireAuth, resolveInquiry);

// POST /api/inquiries/submit - Submit an inquiry (public route)
router.post("/submit", createInquiry);

export default router;
