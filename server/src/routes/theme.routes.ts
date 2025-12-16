import { Router } from "express";
import { requireRole } from "../middlewares/auth.middleware";
import {
  getThemeBySlugController,
  updateThemeController,
  getThemeStatusController,
  getThemeByBarangayIdController,
} from "../controllers/theme.controller";

const router = Router();

// GET /api/themes/slug/:slug - fetch theme by barangay slug (public)
router.get("/slug/:slug", getThemeBySlugController);

// GET /api/themes/:barangayId - fetch theme config by barangay ID (SK Official only)
router.get("/:barangayId", requireRole([1]), getThemeByBarangayIdController);

// PUT /api/themes/:barangayId - upsert/update existing theme (SK Official only)
router.put("/:barangayId", requireRole([1]), updateThemeController);

// GET /api/themes/user/:userId/status - get theme status for SK Official (SK Official only)
// Note: The path is /api/themes/user/:userId/status but functionally equivalent to /api/users/:userId/theme-status
router.get("/user/:userId/status", requireRole([1]), getThemeStatusController);

export default router;
