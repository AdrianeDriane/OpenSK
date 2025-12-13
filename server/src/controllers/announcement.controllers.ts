import { Request, Response } from "express";
import { prisma } from "../db/prisma";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    barangayId: number;
  };
}

export const getAnnouncements = async (
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

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where: { barangayId },
        include: {
          creator: {
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
      prisma.announcement.count({ where: { barangayId } }),
    ]);

    return res.status(200).json({
      announcements,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return res.status(500).json({ error: "Failed to fetch announcements" });
  }
};

export const createAnnouncement = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { title, description, tag } = req.body;
    const userId = req.user?.id;
    const barangayId = req.user?.barangayId;

    if (!userId || !barangayId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!title || !description || !tag) {
      return res
        .status(400)
        .json({ error: "Title, description, and tag are required" });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        description,
        tag,
        createdAt: new Date(),
        barangayId,
        createdBy: userId,
      },
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return res.status(201).json(announcement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    return res.status(500).json({ error: "Failed to create announcement" });
  }
};
