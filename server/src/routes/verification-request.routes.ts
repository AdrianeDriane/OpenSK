import { Router } from "express";
import multer from "multer";
import { requireRole } from "../middlewares/auth.middleware";
import {
  submitVerificationRequest,
  getMyVerificationRequest,
} from "../controllers/verification-request.controllers";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Upload fields for verification documents
const verificationUpload = upload.fields([
  { name: "validId", maxCount: 1 },
  { name: "supportingDoc", maxCount: 1 },
]);

// GET /api/verification-requests/me - Get current user's verification request (SK Official only)
router.get("/me", requireRole([1]), getMyVerificationRequest);

// POST /api/verification-requests - Submit a new verification request (SK Official only)
router.post(
  "/",
  requireRole([1]),
  verificationUpload,
  submitVerificationRequest
);

export default router;
