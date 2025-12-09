import { prisma } from "../db/prisma";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const bypassVerification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // from requireAuth middleware
    const { barangayId } = req.body;

    if (!barangayId) {
      return res.status(400).json({ message: "barangayId is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        barangayId,
        verified: true,
      },
    });

    const newToken = jwt.sign(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        verified: updatedUser.verified,
        roleId: updatedUser.roleId,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "User verification bypassed successfully",
      user: updatedUser,
      token: newToken,
    });
  } catch (error) {
    console.error("Bypass verification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
