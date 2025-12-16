import { Router } from "express";
import multer from "multer";
import { requireRole } from "../middlewares/auth.middleware";
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

// Authenticated routes (SK Official only)
router.get("/", requireRole([1]), listDocuments);
router.post("/", requireRole([1]), upload.single("file"), createDocument);
router.delete("/:id", requireRole([1]), deleteDocument);

export default router;
