import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  listDocuments,
  createDocument,
  deleteDocument,
} from "../controllers/document.controllers";

const router = Router();
const upload = multer();

router.get("/", requireAuth, listDocuments);
router.post("/", requireAuth, upload.single("file"), createDocument);
router.delete("/:id", requireAuth, deleteDocument);

export default router;
