import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  createOfficial,
  deleteOfficial,
  listOfficials,
} from "../controllers/sk-official.controllers";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/", requireAuth, listOfficials);
router.post("/", requireAuth, upload.single("image"), createOfficial);
router.delete("/:id", requireAuth, deleteOfficial);

export default router;
