import { Router } from "express";
import { createInquiry } from "../controllers/inquiry.controllers";

const router = Router();

// POST /api/inquiries/submit - Submit an inquiry (public route)
router.post("/submit", createInquiry);

export default router;
