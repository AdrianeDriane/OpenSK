import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controllers";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Protected route - requires authentication
router.get("/stats", requireAuth, getDashboardStats);

export default router;
