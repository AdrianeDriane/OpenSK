import express from "express";
import passport from "../config/passport";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { requireAuth } from "../middlewares/auth.middleware";
import { getCurrentUser } from "../controllers/auth.controllers";

const router = express.Router();

// GET /api/auth/me - Get current user info
router.get("/me", requireAuth, getCurrentUser);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failed",
  }),
  async (req: any, res) => {
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        roleId: req.user.roleId,
        verified: req.user.verified,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        barangayId: req.user.barangayId,
        googleId: req.user.googleId,
      },
      ENV.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Redirect with token to frontend
    res.redirect(`${ENV.CLIENT_URL}/auth/success?token=${token}`);
  }
);

router.get("/failed", (req, res) => {
  res.status(401).json({ message: "Authentication failed" });
});

export default router;
