import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/auth.middleware";
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

// GET /api/verification-requests/me - Get current user's verification request
router.get("/me", requireAuth, getMyVerificationRequest);

// POST /api/verification-requests - Submit a new verification request
router.post("/", requireAuth, verificationUpload, submitVerificationRequest);

export default router;
