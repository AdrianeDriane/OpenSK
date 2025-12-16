import { Request, Response } from "express";
import { prisma } from "../db/prisma";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    barangayId: number | null;
  };
}

interface CreateInquiryRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
    barangaySlug: string;
  };
}

export const getInquiries = async (
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

    const status = req.query.status as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const where: { barangayId: number; status?: { name: string } } = {
      barangayId,
    };

    if (status && (status === "Open" || status === "Resolved")) {
      where.status = { name: status };
    }

    // Get inquiries and total count
    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: {
          status: {
            select: { name: true },
          },
          responder: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.inquiry.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      data: inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("❌ Error fetching inquiries:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while fetching inquiries",
      details: (error as Error)?.message,
    });
  }
};

export const resolveInquiry = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const inquiryId = parseInt(req.params.id);
    const barangayId = req.user?.barangayId;

    if (!userId || !barangayId) {
      return res.status(400).json({
        error: "User not authenticated properly",
      });
    }

    if (isNaN(inquiryId)) {
      return res.status(400).json({
        error: "Invalid inquiry ID",
      });
    }

    // Check if inquiry exists and belongs to the user's barangay
    const inquiry = await prisma.inquiry.findFirst({
      where: {
        id: inquiryId,
        barangayId,
      },
    });

    if (!inquiry) {
      return res.status(404).json({
        error: "Inquiry not found or does not belong to your barangay",
      });
    }

    // Update inquiry to resolved
    const updatedInquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: {
        statusId: 2, // Resolved status
        respondedBy: userId,
      },
      include: {
        status: {
          select: { name: true },
        },
        responder: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Inquiry marked as resolved successfully",
      data: updatedInquiry,
    });
  } catch (error: unknown) {
    console.error("❌ Error resolving inquiry:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while resolving the inquiry",
      details: (error as Error)?.message,
    });
  }
};

export const createInquiry = async (
  req: CreateInquiryRequest,
  res: Response
) => {
  try {
    const { firstName, lastName, email, subject, message, barangaySlug } =
      req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !subject ||
      !message ||
      !barangaySlug
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: firstName, lastName, email, subject, message, barangaySlug",
      });
    }

    // Find barangay by slug
    const barangay = await prisma.barangay.findUnique({
      where: { slug: barangaySlug },
    });

    if (!barangay) {
      return res.status(404).json({
        error: `Barangay with slug "${barangaySlug}" not found`,
      });
    }

    // Get default "Open" status (id=1)
    const openStatusId = 1;

    // Create inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        senderFirstName: firstName,
        senderLastName: lastName,
        senderEmail: email,
        subject,
        message,
        barangayId: barangay.id,
        statusId: openStatusId,
        createdAt: new Date(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      data: inquiry,
    });
  } catch (error: any) {
    console.error("❌ Error creating inquiry:", error);
    return res.status(500).json({
      error: "An unexpected error occurred while submitting the inquiry",
      details: error?.message,
    });
  }
};
