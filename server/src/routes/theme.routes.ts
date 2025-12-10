import { Router } from "express";
import { updateThemeController } from "../controllers/theme.controller";

const router = Router();

// PUT /api/themes/:barangayId - upsert/update existing theme
router.put("/:barangayId", updateThemeController);

export default router;
