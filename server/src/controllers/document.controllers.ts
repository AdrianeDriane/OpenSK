import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { uploadImageToS3, deleteFromS3 } from "../utils/s3";
import path from "path";

export const listDocuments = async (req: Request, res: Response) => {
  try {
    const barangayId = (req.user as any)?.barangayId;
    if (!barangayId)
      return res.status(400).json({ message: "Barangay not found for user" });

    const documents = await prisma.document.findMany({
      where: { barangayId },
      orderBy: { createdAt: "desc" },
      include: { type: true },
    });

    const types = await prisma.documentType.findMany({
      orderBy: { name: "asc" },
    });

    res.json({ documents, types });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    if (!user?.barangayId || !user?.id)
      return res.status(400).json({ message: "Invalid user context" });

    const { title, description, year, typeId } = req.body as {
      title: string;
      description?: string;
      year?: string | number;
      typeId: string | number;
    };

    if (!title || !typeId)
      return res.status(400).json({ message: "title and typeId are required" });
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) return res.status(400).json({ message: "File is required" });

    const safeFileName = path
      .basename(file.originalname)
      .replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `documents/${user.barangayId}/${Date.now()}_${safeFileName}`;
    const fileUrl = await uploadImageToS3(key, file);

    const created = await prisma.document.create({
      data: {
        title,
        description: description || null,
        year: year ? Number(year) : null,
        fileUrl,
        createdAt: new Date(),
        barangayId: Number(user.barangayId),
        uploadedBy: Number(user.id),
        typeId: Number(typeId),
      },
    });

    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create document" });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await prisma.document.findUnique({ where: { id: Number(id) } });
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Try to infer S3 key from URL
    const keyMatch = doc.fileUrl.match(/https?:\/\/[^/]+\/.+\/(.+)$/);
    let key: string | null = null;
    if (keyMatch) {
      // full path after bucket domain
      key = doc.fileUrl.split(".amazonaws.com/")[1] || null;
    }
    if (key) {
      try {
        await deleteFromS3(key);
      } catch (e) {
        console.warn("S3 delete failed, proceeding to remove DB record", e);
      }
    }

    await prisma.document.delete({ where: { id: Number(id) } });
    res.json({ message: "Document deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete document" });
  }
};
