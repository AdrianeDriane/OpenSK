import { Router } from "express";
import {
  getBarangays,
  getBarangaysWithPortalStatus,
} from "../controllers/barangay.controllers";

const router = Router();

router.get("/", getBarangays);
router.get("/portals", getBarangaysWithPortalStatus);

export default router;
