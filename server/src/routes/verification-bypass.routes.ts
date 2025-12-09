import { Router } from "express";
import { bypassVerification } from "../controllers/verification-bypass.controllers";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// PATCH /api/verify/bypass
router.patch("/bypass", requireAuth, bypassVerification);

export default router;
