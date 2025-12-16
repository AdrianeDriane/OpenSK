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

export const getDocumentsBySlugAndType = async (
  req: Request,
  res: Response
) => {
  try {
    const { slug, typeName } = req.params as {
      slug?: string;
      typeName?: string;
    };

    if (!slug || !typeName) {
      return res
        .status(400)
        .json({ error: "Barangay slug and document type are required" });
    }

    const barangay = await prisma.barangay.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!barangay) {
      return res.status(404).json({ error: "Barangay not found" });
    }

    const documentType = await prisma.documentType.findFirst({
      where: {
        name: {
          equals: typeName,
          mode: "insensitive",
        },
      },
      select: { id: true, name: true },
    });

    if (!documentType) {
      return res.status(404).json({ error: "Document type not found" });
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where: { barangayId: barangay.id, typeId: documentType.id },
        select: {
          id: true,
          title: true,
          description: true,
          year: true,
          fileUrl: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.document.count({
        where: { barangayId: barangay.id, typeId: documentType.id },
      }),
    ]);

    return res.status(200).json({
      barangaySlug: slug,
      documentType: documentType.name,
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching documents by slug and type:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

export const getDocumentTypeSummaryBySlug = async (
  req: Request,
  res: Response
) => {
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

    const [types, groupedCounts] = await Promise.all([
      prisma.documentType.findMany({
        select: { id: true, name: true },
        orderBy: { id: "asc" },
      }),
      prisma.document.groupBy({
        by: ["typeId"],
        where: { barangayId: barangay.id },
        _count: { _all: true },
      }),
    ]);

    const countsMap = new Map<number, number>();
    groupedCounts.forEach((item) => {
      countsMap.set(item.typeId, item._count._all);
    });

    const summary = types.map((type) => ({
      id: type.id,
      name: type.name,
      count: countsMap.get(type.id) ?? 0,
    }));

    return res.status(200).json({
      barangaySlug: slug,
      types: summary,
    });
  } catch (err) {
    console.error("Error fetching document type summary:", err);
    res.status(500).json({ error: "Failed to fetch document summary" });
  }
};

export const getAllDocumentsBySlug = async (req: Request, res: Response) => {
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

    const documents = await prisma.document.findMany({
      where: { barangayId: barangay.id },
      select: {
        id: true,
        title: true,
        description: true,
        year: true,
        fileUrl: true,
        createdAt: true,
        type: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      barangaySlug: slug,
      documents,
    });
  } catch (err) {
    console.error("Error fetching all documents by slug:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};
