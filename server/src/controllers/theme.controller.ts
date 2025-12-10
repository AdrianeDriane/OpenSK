import { Request, Response } from "express";
import {
  updateTheme,
  validateThemeConfig,
  HttpError,
  ThemeConfigPayload,
  getThemeBySlug,
  getThemeStatus,
} from "../services/theme.service";

const parseBarangayId = (value: string) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const handleError = (res: Response, error: unknown) => {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ message: error.message });
  }
  console.error("Theme endpoint error:", error);
  return res.status(500).json({ message: "Internal server error" });
};

// @desc    Upsert barangay theme configuration
// @route   PUT /api/themes/:barangayId
// @access  Private (Verified SK Officials only)
export const updateThemeController = async (req: Request, res: Response) => {
  const barangayId = parseBarangayId(req.params.barangayId);
  if (!barangayId) {
    return res.status(400).json({ message: "Invalid barangayId" });
  }

  const configBody = (req.body as any)?.config ?? req.body;
  const validation = validateThemeConfig(configBody as ThemeConfigPayload);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    const theme = await updateTheme(barangayId, validation.data);
    return res.status(200).json({ message: "Theme updated", data: theme });
  } catch (error) {
    return handleError(res, error);
  }
};

// @desc    Get barangay theme by slug
// @route   GET /api/themes/slug/:slug
// @access  Public
export const getThemeBySlugController = async (req: Request, res: Response) => {
  try {
    const result = await getThemeBySlug(req.params.slug);
    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

// @desc    Get theme status for SK Official
// @route   GET /api/users/:userId/theme-status
// @access  Private (SK Officials only)
export const getThemeStatusController = async (req: Request, res: Response) => {
  const userId = parseBarangayId(req.params.userId); // Reusing parseBarangayId for number validation
  if (!userId) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  try {
    const status = await getThemeStatus(userId);
    return res.status(200).json(status);
  } catch (error) {
    return handleError(res, error);
  }
};
