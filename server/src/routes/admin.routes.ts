import { Router } from "express";
import { requireRole } from "../middlewares/auth.middleware";
import {
  getDashboardStats,
  getAllVerificationRequests,
  getVerificationRequestById,
  approveVerificationRequest,
  rejectVerificationRequest,
} from "../controllers/admin.controllers";

const router = Router();

// All admin routes require Admin role (roleId = 2)
const requireAdmin = requireRole([2]);

// GET /api/admin/stats - Get dashboard statistics
router.get("/stats", requireAdmin, getDashboardStats);

// GET /api/admin/verification-requests - Get all verification requests
router.get("/verification-requests", requireAdmin, getAllVerificationRequests);

// GET /api/admin/verification-requests/:id - Get a single verification request
router.get(
  "/verification-requests/:id",
  requireAdmin,
  getVerificationRequestById
);

// PATCH /api/admin/verification-requests/:id/approve - Approve a verification request
router.patch(
  "/verification-requests/:id/approve",
  requireAdmin,
  approveVerificationRequest
);

// PATCH /api/admin/verification-requests/:id/reject - Reject a verification request
router.patch(
  "/verification-requests/:id/reject",
  requireAdmin,
  rejectVerificationRequest
);

export default router;
