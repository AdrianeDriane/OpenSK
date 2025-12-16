import { Router } from "express";
import multer from "multer";
import { requireRole } from "../middlewares/auth.middleware";
import {
  createOfficial,
  deleteOfficial,
  listOfficials,
  getOfficialsBySlug,
} from "../controllers/sk-official.controllers";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Public route
router.get("/public/:slug", getOfficialsBySlug);

// Authenticated routes (SK Official only)
router.get("/", requireRole([1]), listOfficials);
router.post("/", requireRole([1]), upload.single("image"), createOfficial);
router.delete("/:id", requireRole([1]), deleteOfficial);

export default router;
