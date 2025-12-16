import { Request, Response } from "express";
import { prisma } from "../db/prisma";

const ROLE = {
  SK_OFFICIAL: 1,
  ADMIN: 2,
};

export const getBarangays = async (req: Request, res: Response) => {
  try {
    const barangays = await prisma.barangay.findMany({
      orderBy: { name: "asc" },
    });

    // If database returned empty dataset (should not happen, but safe to check)
    if (!barangays || barangays.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No barangays found.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Barangays fetched successfully.",
      data: barangays,
    });
  } catch (error: any) {
    console.error("❌ Error fetching barangays:", error);
    // Generic unhandled error
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching barangays.",
      error: error?.message,
    });
  }
};

/**
 * Get all barangays with their portal active status
 * A barangay is "active" if it has at least one verified SK Official
 * GET /api/barangays/portals
 */
export const getBarangaysWithPortalStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const barangays = await prisma.barangay.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        users: {
          where: {
            verified: true,
            roleId: ROLE.SK_OFFICIAL,
          },
          select: {
            id: true,
          },
        },
      },
    });

    const barangaysWithStatus = barangays.map((barangay) => ({
      id: barangay.id,
      name: barangay.name,
      slug: barangay.slug,
      isActive: barangay.users.length > 0,
    }));

    return res.status(200).json({
      success: true,
      message: "Barangays with portal status fetched successfully.",
      data: barangaysWithStatus,
    });
  } catch (error: any) {
    console.error("❌ Error fetching barangays with portal status:", error);
    return res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while fetching barangays with portal status.",
      error: error?.message,
    });
  }
};
