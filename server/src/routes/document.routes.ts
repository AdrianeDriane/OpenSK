import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  listDocuments,
  createDocument,
  deleteDocument,
  getDocumentsBySlugAndType,
  getDocumentTypeSummaryBySlug,
} from "../controllers/document.controllers";

const router = Router();
const upload = multer();

// Public routes
router.get("/public/:slug/types", getDocumentTypeSummaryBySlug);
router.get("/public/:slug/:typeName", getDocumentsBySlugAndType);

// Authenticated routes
router.get("/", requireAuth, listDocuments);
router.post("/", requireAuth, upload.single("file"), createDocument);
router.delete("/:id", requireAuth, deleteDocument);

export default router;
