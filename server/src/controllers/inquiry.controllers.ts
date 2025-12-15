import { Request, Response } from "express";
import { prisma } from "../db/prisma";

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
