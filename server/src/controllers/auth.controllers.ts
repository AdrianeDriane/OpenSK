import { Request, Response } from "express";
import { prisma } from "../db/prisma";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    barangayId: number;
  };
}

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        verified: true,
        roleId: true,
        barangayId: true,
        barangay: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error: unknown) {
    console.error("❌ Error fetching current user:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while fetching user data",
      details: (error as Error)?.message,
    });
  }
};
