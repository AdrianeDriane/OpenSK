import { Request, Response } from "express";
import { prisma } from "../db/prisma";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    barangayId: number | null;
  };
}

export const getDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const barangayId = req.user?.barangayId;

    if (!barangayId) {
      return res
        .status(400)
        .json({ error: "User not associated with any barangay" });
    }

    // Fetch all stats in parallel for better performance
    const [pendingInquiries, activeOfficials, totalDocuments] =
      await Promise.all([
        // Count inquiries with "Open" status (statusId = 1)
        prisma.inquiry.count({
          where: {
            barangayId,
            statusId: 1, // Open status
          },
        }),
        // Count verified users in the barangay
        prisma.user.count({
          where: {
            barangayId,
            verified: true,
          },
        }),
        // Count total documents
        prisma.document.count({
          where: {
            barangayId,
          },
        }),
      ]);

    return res.status(200).json({
      success: true,
      data: {
        pendingInquiries,
        activeOfficials,
        documentsUploaded: totalDocuments,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard statistics",
    });
  }
};
