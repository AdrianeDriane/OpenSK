import { Request, Response } from "express";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "../db/prisma";
import { uploadImageToS3, deleteFromS3 } from "../utils/s3";
import { SKOfficialRole } from "../../prisma/generated/enums";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    barangayId: number | null;
  };
  file?: Express.Multer.File;
}

const VALID_ROLES = new Set<SKOfficialRole>([
  SKOfficialRole.SK_COUNCILOR,
  SKOfficialRole.CHAIRMAN,
  SKOfficialRole.TREASURER,
  SKOfficialRole.SECRETARY,
]);

export const listOfficials = async (
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

    const officials = await prisma.sKOfficial.findMany({
      where: { barangayId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ officials });
  } catch (error) {
    console.error("Error fetching SK officials:", error);
    return res.status(500).json({ error: "Failed to fetch SK officials" });
  }
};

export const createOfficial = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const barangayId = req.user?.barangayId;
    const userId = req.user?.id;
    const file = req.file;
    const { name, role, email, contactNumber, facebookProfile } = req.body;

    if (!barangayId || !userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!name || !role || !email || !contactNumber) {
      return res
        .status(400)
        .json({ error: "Name, role, email, and contact number are required" });
    }

    const roleValue = role as SKOfficialRole;
    if (!VALID_ROLES.has(roleValue)) {
      return res.status(400).json({ error: "Invalid role value" });
    }

    if (!file) {
      return res.status(400).json({ error: "Profile image is required" });
    }

    const extension = path.extname(file.originalname).toLowerCase();
    const key = `sk-officials/${barangayId}/${Date.now()}-${randomUUID()}${extension}`;
    const imageUrl = await uploadImageToS3(key, file);

    const official = await prisma.sKOfficial.create({
      data: {
        name,
        role: roleValue,
        email,
        contactNumber,
        facebookProfile,
        imageUrl,
        imageKey: key,
        barangayId,
        createdBy: userId,
      },
    });

    return res.status(201).json(official);
  } catch (error) {
    console.error("Error creating SK official:", error);
    return res.status(500).json({ error: "Failed to create SK official" });
  }
};

export const deleteOfficial = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const barangayId = req.user?.barangayId;
    const id = parseInt(req.params.id, 10);

    if (!barangayId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid official id" });
    }

    const official = await prisma.sKOfficial.findUnique({ where: { id } });

    if (!official || official.barangayId !== barangayId) {
      return res.status(404).json({ error: "SK official not found" });
    }

    if (official.imageKey) {
      try {
        await deleteFromS3(official.imageKey);
      } catch (deleteError) {
        console.error("Failed to delete image from S3:", deleteError);
        // Continue with deletion even if image cleanup fails
      }
    }

    await prisma.sKOfficial.delete({ where: { id } });

    return res.status(200).json({ message: "SK official deleted" });
  } catch (error) {
    console.error("Error deleting SK official:", error);
    return res.status(500).json({ error: "Failed to delete SK official" });
  }
};

export const getOfficialsBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params as { slug?: string };

    if (!slug) {
      return res.status(400).json({ error: "Barangay slug is required" });
    }

    const barangay = await prisma.barangay.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!barangay) {
      return res.status(404).json({ error: "Barangay not found" });
    }

    const officials = await prisma.sKOfficial.findMany({
      where: { barangayId: barangay.id },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        contactNumber: true,
        facebookProfile: true,
        imageUrl: true,
      },
      orderBy: [{ role: "asc" }, { createdAt: "desc" }],
    });

    return res.status(200).json({
      barangaySlug: slug,
      officials,
    });
  } catch (error) {
    console.error("Error fetching SK officials by slug:", error);
    return res.status(500).json({ error: "Failed to fetch SK officials" });
  }
};
