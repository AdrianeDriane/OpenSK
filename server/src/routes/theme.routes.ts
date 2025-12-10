import { Router } from "express";
import {
  getThemeBySlugController,
  updateThemeController,
} from "../controllers/theme.controller";

const router = Router();

// GET /api/themes/slug/:slug - fetch theme by barangay slug
router.get("/slug/:slug", getThemeBySlugController);

// PUT /api/themes/:barangayId - upsert/update existing theme
router.put("/:barangayId", updateThemeController);

export default router;
