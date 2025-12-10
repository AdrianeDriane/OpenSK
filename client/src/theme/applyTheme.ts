import type { ThemeConfig } from "../types/theme";

const fallbackTheme: ThemeConfig = {
  colors: {
    primary: "#203972",
    secondary: "#1a2e5a",
    accent: "#fbbf24",
    background: "#f7f9ff",
  },
  typography: {
    headingFont: "Inter",
    bodyFont: "Inter",
  },
  buttons: {
    primary: {
      borderRadius: 12,
      paddingX: 20,
      paddingY: 12,
      variant: "solid",
    },
    secondary: {
      borderRadius: 12,
      paddingX: 18,
      paddingY: 11,
      variant: "outline",
    },
  },
};

const buildFontsHref = (fonts: string[]) => {
  const families = fonts
    .map(
      (font) =>
        `family=${encodeURIComponent(font).replace(
          /%20/g,
          "+"
        )}:wght@400;600;700`
    )
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
};

export const applyTheme = (config?: ThemeConfig | null) => {
  if (typeof document === "undefined") return;

  const theme = config ?? fallbackTheme;
  const root = document.documentElement;

  root.style.setProperty("--color-primary", theme.colors.primary);
  root.style.setProperty("--color-secondary", theme.colors.secondary);
  root.style.setProperty("--color-accent", theme.colors.accent);
  root.style.setProperty("--color-background", theme.colors.background);

  root.style.setProperty(
    "--font-heading",
    `'${theme.typography.headingFont}', 'Inter', system-ui, -apple-system, sans-serif`
  );
  root.style.setProperty(
    "--font-body",
    `'${theme.typography.bodyFont}', 'Inter', system-ui, -apple-system, sans-serif`
  );

  root.style.setProperty(
    "--btn-primary-radius",
    `${theme.buttons.primary.borderRadius}px`
  );
  root.style.setProperty(
    "--btn-primary-padding-x",
    `${theme.buttons.primary.paddingX}px`
  );
  root.style.setProperty(
    "--btn-primary-padding-y",
    `${theme.buttons.primary.paddingY}px`
  );
  root.style.setProperty(
    "--btn-primary-variant",
    theme.buttons.primary.variant
  );

  root.style.setProperty(
    "--btn-secondary-radius",
    `${theme.buttons.secondary.borderRadius}px`
  );
  root.style.setProperty(
    "--btn-secondary-padding-x",
    `${theme.buttons.secondary.paddingX}px`
  );
  root.style.setProperty(
    "--btn-secondary-padding-y",
    `${theme.buttons.secondary.paddingY}px`
  );
  root.style.setProperty(
    "--btn-secondary-variant",
    theme.buttons.secondary.variant
  );

  const fonts = Array.from(
    new Set([theme.typography.headingFont, theme.typography.bodyFont])
  );

  if (fonts.length) {
    const href = buildFontsHref(fonts);
    let link = document.getElementById(
      "portal-font-loader"
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = "portal-font-loader";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = href;
  }
};

export const defaultThemeConfig = fallbackTheme;
