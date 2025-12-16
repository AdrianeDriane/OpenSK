import { Router } from "express";
import {
  createInquiry,
  getInquiries,
  resolveInquiry,
} from "../controllers/inquiry.controllers";
import { requireRole } from "../middlewares/auth.middleware";

const router = Router();

// GET /api/inquiries - Get list of inquiries for SK Official's barangay (SK Official only)
router.get("/", requireRole([1]), getInquiries);

// PATCH /api/inquiries/:id/resolve - Mark inquiry as resolved (SK Official only)
router.patch("/:id/resolve", requireRole([1]), resolveInquiry);

// POST /api/inquiries/submit - Submit an inquiry (public route)
router.post("/submit", createInquiry);

export default router;
