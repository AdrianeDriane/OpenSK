import { Request, Response } from "express";
import { prisma } from "../db/prisma";

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
