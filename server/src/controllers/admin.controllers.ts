import { Request, Response } from "express";
import { prisma } from "../db/prisma";

// Status IDs (matching seed data)
const STATUS = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
} as const;

// Role IDs
const ROLE = {
  SK_OFFICIAL: 1,
  ADMIN: 2,
} as const;

/**
 * Get dashboard statistics for admin
 * GET /api/admin/stats
 */
export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    // Run all counts in parallel for better performance
    const [
      pendingVerifications,
      rejectedRequests,
      approvedBarangaysCount,
      totalVerifiedSKOfficials,
    ] = await Promise.all([
      // Count pending verification requests
      prisma.verificationRequest.count({
        where: { statusId: STATUS.PENDING },
      }),

      // Count rejected verification requests
      prisma.verificationRequest.count({
        where: { statusId: STATUS.REJECTED },
      }),

      // Count distinct barangays with at least one verified SK Official
      prisma.barangay.count({
        where: {
          users: {
            some: {
              verified: true,
              roleId: ROLE.SK_OFFICIAL,
            },
          },
        },
      }),

      // Count verified SK Officials only
      prisma.user.count({
        where: {
          verified: true,
          roleId: ROLE.SK_OFFICIAL,
        },
      }),
    ]);

    res.json({
      pendingVerifications,
      approvedBarangays: approvedBarangaysCount,
      rejectedRequests,
      totalSKOfficials: totalVerifiedSKOfficials,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
};

/**
 * Get all verification requests with user and document details
 * GET /api/admin/verification-requests
 * Query params: status (optional) - filter by status: 'pending', 'approved', 'rejected'
 */
export const getAllVerificationRequests = async (
  req: Request,
  res: Response
) => {
  try {
    const { status } = req.query;

    // Build where clause based on status filter
    let statusFilter: number | undefined;
    if (status === "pending") statusFilter = STATUS.PENDING;
    else if (status === "approved") statusFilter = STATUS.APPROVED;
    else if (status === "rejected") statusFilter = STATUS.REJECTED;

    const requests = await prisma.verificationRequest.findMany({
      where: statusFilter ? { statusId: statusFilter } : undefined,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            verified: true,
            barangay: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        barangay: {
          select: {
            id: true,
            name: true,
          },
        },
        status: true,
        documents: {
          include: {
            type: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [{ statusId: "asc" }, { submittedAt: "desc" }],
    });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching verification requests:", error);
    res.status(500).json({ error: "Failed to fetch verification requests" });
  }
};

/**
 * Get a single verification request by ID
 * GET /api/admin/verification-requests/:id
 */
export const getVerificationRequestById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const request = await prisma.verificationRequest.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            verified: true,
            barangay: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        barangay: {
          select: {
            id: true,
            name: true,
          },
        },
        status: true,
        documents: {
          include: {
            type: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!request) {
      return res.status(404).json({ error: "Verification request not found" });
    }

    res.json(request);
  } catch (error) {
    console.error("Error fetching verification request:", error);
    res.status(500).json({ error: "Failed to fetch verification request" });
  }
};

/**
 * Approve a verification request
 * PATCH /api/admin/verification-requests/:id/approve
 */
export const approveVerificationRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user?.id;

    if (!adminId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const requestId = parseInt(id, 10);

    // Find the verification request
    const verificationRequest = await prisma.verificationRequest.findUnique({
      where: { id: requestId },
      include: {
        user: true,
      },
    });

    if (!verificationRequest) {
      return res.status(404).json({ error: "Verification request not found" });
    }

    if (verificationRequest.statusId !== STATUS.PENDING) {
      return res.status(400).json({
        error: "Only pending requests can be approved",
      });
    }

    // Get the barangayId from the request (stored when user submitted)
    const barangayId = verificationRequest.barangayId;

    if (!barangayId) {
      return res.status(400).json({
        error: "Verification request has no associated barangay",
      });
    }

    // Update request and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the verification request
      const updatedRequest = await tx.verificationRequest.update({
        where: { id: requestId },
        data: {
          statusId: STATUS.APPROVED,
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          status: true,
        },
      });

      // Set user as verified and link to barangay
      await tx.user.update({
        where: { id: verificationRequest.userId },
        data: {
          verified: true,
          barangayId: barangayId,
        },
      });

      return updatedRequest;
    });

    res.json({
      message: "Verification request approved successfully",
      request: result,
    });
  } catch (error) {
    console.error("Error approving verification request:", error);
    res.status(500).json({ error: "Failed to approve verification request" });
  }
};

/**
 * Reject a verification request
 * PATCH /api/admin/verification-requests/:id/reject
 * Body: { reason: string }
 */
export const rejectVerificationRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = (req as any).user?.id;

    if (!adminId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      return res.status(400).json({ error: "Rejection reason is required" });
    }

    const requestId = parseInt(id, 10);

    // Find the verification request
    const verificationRequest = await prisma.verificationRequest.findUnique({
      where: { id: requestId },
    });

    if (!verificationRequest) {
      return res.status(404).json({ error: "Verification request not found" });
    }

    if (verificationRequest.statusId !== STATUS.PENDING) {
      return res.status(400).json({
        error: "Only pending requests can be rejected",
      });
    }

    // Update the verification request
    const updatedRequest = await prisma.verificationRequest.update({
      where: { id: requestId },
      data: {
        statusId: STATUS.REJECTED,
        rejectionReason: reason.trim(),
        reviewedBy: adminId,
        reviewedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        status: true,
      },
    });

    res.json({
      message: "Verification request rejected",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error rejecting verification request:", error);
    res.status(500).json({ error: "Failed to reject verification request" });
  }
};
