import { Router } from "express";
import { getBarangays } from "../controllers/barangay.controllers";

const router = Router();

router.get("/", getBarangays);

export default router;
