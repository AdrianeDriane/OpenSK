import { Prisma } from "../../prisma/generated/client";
import { prisma } from "../db/prisma";

export type ThemeButtonVariant = "solid" | "outline" | "ghost";

export type ThemeButtonConfig = {
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  variant: ThemeButtonVariant;
};

export type ThemeConfigPayload = {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  buttons: {
    primary: ThemeButtonConfig;
    secondary: ThemeButtonConfig;
  };
};

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const validateThemeConfig = (
  input: unknown
):
  | { valid: false; message: string }
  | { valid: true; data: ThemeConfigPayload } => {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, message: "config must be a JSON object" };
  }

  const raw = input as Record<string, unknown>;
  const colors = raw.colors as Record<string, unknown> | undefined;
  const typography = raw.typography as Record<string, unknown> | undefined;
  const buttons = raw.buttons as Record<string, unknown> | undefined;

  if (!colors || !typography || !buttons) {
    return {
      valid: false,
      message: "config must include colors, typography, and buttons",
    };
  }

  const colorKeys = ["primary", "secondary", "accent", "background"] as const;
  for (const key of colorKeys) {
    if (!isNonEmptyString(colors[key])) {
      return {
        valid: false,
        message: `colors.${key} must be a non-empty string`,
      };
    }
  }

  const fontKeys = ["headingFont", "bodyFont"] as const;
  for (const key of fontKeys) {
    if (!isNonEmptyString(typography[key])) {
      return {
        valid: false,
        message: `typography.${key} must be a non-empty string`,
      };
    }
  }

  const validateButton = (label: string, value: unknown) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return { valid: false as const, message: `${label} must be an object` };
    }
    const btn = value as Record<string, unknown>;
    const radius = btn.borderRadius;
    const paddingX = btn.paddingX;
    const paddingY = btn.paddingY;
    const variant = btn.variant;

    if (typeof radius !== "number") {
      return {
        valid: false as const,
        message: `${label}.borderRadius must be a number`,
      };
    }
    if (typeof paddingX !== "number") {
      return {
        valid: false as const,
        message: `${label}.paddingX must be a number`,
      };
    }
    if (typeof paddingY !== "number") {
      return {
        valid: false as const,
        message: `${label}.paddingY must be a number`,
      };
    }
    if (variant !== "solid" && variant !== "outline" && variant !== "ghost") {
      return {
        valid: false as const,
        message: `${label}.variant must be one of: solid, outline, ghost`,
      };
    }

    return {
      valid: true as const,
      data: {
        borderRadius: radius,
        paddingX,
        paddingY,
        variant: variant as ThemeButtonVariant,
      },
    };
  };

  const primaryCheck = validateButton("buttons.primary", buttons.primary);
  if (!primaryCheck.valid)
    return { valid: false, message: primaryCheck.message };

  const secondaryCheck = validateButton("buttons.secondary", buttons.secondary);
  if (!secondaryCheck.valid)
    return { valid: false, message: secondaryCheck.message };

  return {
    valid: true,
    data: {
      colors: {
        primary: (colors.primary as string).trim(),
        secondary: (colors.secondary as string).trim(),
        accent: (colors.accent as string).trim(),
        background: (colors.background as string).trim(),
      },
      typography: {
        headingFont: (typography.headingFont as string).trim(),
        bodyFont: (typography.bodyFont as string).trim(),
      },
      buttons: {
        primary: primaryCheck.data,
        secondary: secondaryCheck.data,
      },
    },
  };
};

const ensureBarangayExists = async (barangayId: number) => {
  const barangay = await prisma.barangay.findUnique({
    where: { id: barangayId },
    select: { id: true },
  });
  if (!barangay) {
    throw new HttpError(404, "Barangay not found");
  }
};

export const createTheme = async (
  barangayId: number,
  config: ThemeConfigPayload
) => {
  await ensureBarangayExists(barangayId);

  const existing = await prisma.theme.findUnique({ where: { barangayId } });
  if (existing) {
    throw new HttpError(409, "Theme already exists for this barangay");
  }

  const theme = await prisma.theme.create({
    data: {
      barangayId,
      config: config as Prisma.JsonObject,
      updatedAt: new Date(),
    },
  });

  return theme;
};

export const updateTheme = async (
  barangayId: number,
  config: ThemeConfigPayload
) => {
  await ensureBarangayExists(barangayId);

  const updated = await prisma.theme.upsert({
    where: { barangayId },
    update: {
      config: config as Prisma.JsonObject,
      updatedAt: new Date(),
    },
    create: {
      barangayId,
      config: config as Prisma.JsonObject,
      updatedAt: new Date(),
    },
  });

  return updated;
};
