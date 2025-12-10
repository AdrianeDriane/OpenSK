import { Router } from "express";
import {
  getThemeBySlugController,
  updateThemeController,
  getThemeStatusController,
} from "../controllers/theme.controller";

const router = Router();

// GET /api/themes/slug/:slug - fetch theme by barangay slug
router.get("/slug/:slug", getThemeBySlugController);

// PUT /api/themes/:barangayId - upsert/update existing theme
router.put("/:barangayId", updateThemeController);

// GET /api/themes/user/:userId/status - get theme status for SK Official
// Note: The path is /api/themes/user/:userId/status but functionally equivalent to /api/users/:userId/theme-status
router.get("/user/:userId/status", getThemeStatusController);

export default router;
