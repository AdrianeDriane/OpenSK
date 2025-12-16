import { Request, Response } from "express";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "../db/prisma";
import { uploadImageToS3 } from "../utils/s3";

// Document type IDs (matching seed data)
const DOCUMENT_TYPE_IDS: Record<string, number> = {
  "Certificate of Incumbency": 1,
  "Certificate of Proclamation": 2,
  "Oath of Office": 3,
  "Valid ID": 4,
};

/**
 * Submit a new verification request with documents
 * POST /api/verification-requests
 */
export const submitVerificationRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { barangayId, mobileNumber, role, remarks, supportingDocType } = req.body;

    if (!barangayId) {
      return res.status(400).json({ error: "Barangay is required" });
    }

    if (!supportingDocType || !DOCUMENT_TYPE_IDS[supportingDocType]) {
      return res.status(400).json({ error: "Valid supporting document type is required" });
    }

    // Check if user already has a pending request
    const existingRequest = await prisma.verificationRequest.findFirst({
      where: {
        userId,
        statusId: 1, // Pending
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        error: "You already have a pending verification request",
      });
    }

    // Validate files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files?.validId?.[0]) {
      return res.status(400).json({ error: "Valid ID is required" });
    }
    if (!files?.supportingDoc?.[0]) {
      return res.status(400).json({ error: "Supporting document is required" });
    }

    // Upload documents to S3
    const uploadDocument = async (file: Express.Multer.File, typeId: number) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const key = `verification-docs/${userId}/${Date.now()}-${randomUUID()}${extension}`;
      const fileUrl = await uploadImageToS3(key, file);
      return { fileUrl, typeId, key };
    };

    const [validIdDoc, supportingDoc] = await Promise.all([
      uploadDocument(files.validId[0], DOCUMENT_TYPE_IDS["Valid ID"]),
      uploadDocument(files.supportingDoc[0], DOCUMENT_TYPE_IDS[supportingDocType]),
    ]);

    // Build remarks with additional info
    const fullRemarks = [
      mobileNumber ? `Mobile: ${mobileNumber}` : null,
      role ? `Role: ${role}` : null,
      remarks ? `Notes: ${remarks}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    // Create verification request with documents in a transaction
    const verificationRequest = await prisma.$transaction(async (tx) => {
      // Update user's barangayId (but keep verified as false)
      await tx.user.update({
        where: { id: userId },
        data: { barangayId: parseInt(barangayId, 10) },
      });

      // Create the verification request
      const request = await tx.verificationRequest.create({
        data: {
          userId,
          statusId: 1, // Pending
          remarks: fullRemarks || null,
          submittedAt: new Date(),
          documents: {
            create: [
              { fileUrl: validIdDoc.fileUrl, typeId: validIdDoc.typeId },
              { fileUrl: supportingDoc.fileUrl, typeId: supportingDoc.typeId },
            ],
          },
        },
        include: {
          status: true,
          documents: {
            include: { type: true },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              barangay: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });

      return request;
    });

    return res.status(201).json({
      message: "Verification request submitted successfully",
      request: verificationRequest,
    });
  } catch (error) {
    console.error("Error submitting verification request:", error);
    return res.status(500).json({ error: "Failed to submit verification request" });
  }
};

/**
 * Get the current user's verification request status
 * GET /api/verification-requests/me
 */
export const getMyVerificationRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const request = await prisma.verificationRequest.findFirst({
      where: { userId },
      orderBy: { submittedAt: "desc" },
      include: {
        status: true,
        documents: {
          include: { type: true },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            barangay: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    return res.status(200).json({ request });
  } catch (error) {
    console.error("Error fetching verification request:", error);
    return res.status(500).json({ error: "Failed to fetch verification request" });
  }
};
