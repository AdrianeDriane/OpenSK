export type ThemeButtonVariant = "solid" | "outline" | "ghost";

export interface ThemeButtonStyle {
  borderRadius: number; // pixels
  paddingX: number; // pixels
  paddingY: number; // pixels
  variant: ThemeButtonVariant;
}

export interface ThemeButtonsConfig {
  primary: ThemeButtonStyle;
  secondary: ThemeButtonStyle;
}

export interface ThemeConfig {
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
  buttons: ThemeButtonsConfig;
}
