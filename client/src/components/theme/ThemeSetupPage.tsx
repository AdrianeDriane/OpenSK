import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ThemeButtonStyle, ThemeConfig } from "../../types/theme";
import api from "../../api/axios";
import { getThemeConfig } from "../../api/themeStatus";
import toast from "react-hot-toast";
import { ColorSection } from "./ColorSection";
import { TypographySection } from "./TypographySection";
import { ButtonStyleSection } from "./ButtonStyleSection";
import { ThemePreview } from "./ThemePreview";
import { ArrowLeft } from "lucide-react";

const headingFonts = [
  "Inter",
  "Poppins",
  "Montserrat",
  "Source Sans Pro",
  "Roboto",
  "Merriweather",
  "Playfair Display",
  "Work Sans",
  "Manrope",
  "Public Sans",
];

const bodyFonts = [
  "Inter",
  "Source Sans Pro",
  "Roboto",
  "Nunito",
  "Open Sans",
  "Work Sans",
  "Public Sans",
  "Lato",
  "Noto Sans",
  "Manrope",
];

const defaultConfig: ThemeConfig = {
  colors: {
    primary: "#203972",
    secondary: "#1a2e5a",
    accent: "#fbbf24",
    background: "#f7f9ff",
  },
  typography: {
    headingFont: headingFonts[0],
    bodyFont: bodyFonts[0],
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

export const ThemeSetupPage = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<ThemeConfig>(defaultConfig);
  const [barangayId, setBarangayId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTheme, setIsFetchingTheme] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Decode token and get barangayId
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setBarangayId(decoded.barangayId || null);
      } catch {
        console.error("Failed to decode token");
        setIsFetchingTheme(false);
      }
    } else {
      setIsFetchingTheme(false);
    }
  }, []);

  // Fetch existing theme configuration
  useEffect(() => {
    const fetchExistingTheme = async () => {
      if (!barangayId) {
        setIsFetchingTheme(false);
        return;
      }

      try {
        const { config: existingConfig } = await getThemeConfig(barangayId);
        if (existingConfig) {
          setConfig(existingConfig);
        }
      } catch (err) {
        console.error("Failed to fetch existing theme:", err);
        // Use default config if fetch fails - this is non-blocking
      } finally {
        setIsFetchingTheme(false);
      }
    };

    fetchExistingTheme();
  }, [barangayId]);

  const handleColorChange = (
    key: keyof ThemeConfig["colors"],
    value: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  };

  const handleTypographyChange = (
    key: keyof ThemeConfig["typography"],
    value: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      typography: { ...prev.typography, [key]: value },
    }));
  };

  const handleButtonChange = <
    R extends keyof ThemeConfig["buttons"],
    K extends keyof ThemeButtonStyle
  >(
    role: R,
    key: K,
    value: ThemeButtonStyle[K]
  ) => {
    setConfig((prev) => ({
      ...prev,
      buttons: {
        ...prev.buttons,
        [role]: { ...prev.buttons[role], [key]: value },
      },
    }));
  };

  useEffect(() => {
    const fonts = Array.from(
      new Set([config.typography.headingFont, config.typography.bodyFont])
    );
    const families = fonts
      .map(
        (font) =>
          `family=${encodeURIComponent(font).replace(
            /%20/g,
            "+"
          )}:wght@400;600;700`
      )
      .join("&");
    const href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
    let link = document.getElementById(
      "theme-font-loader"
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = "theme-font-loader";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [config.typography]);

  const saveTheme = async () => {
    if (!barangayId) {
      const errorMsg = "Barangay ID not found. Please log in again.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.put(`/themes/${barangayId}`, config);
      toast.success("Theme saved successfully!");
      setError(null);
      // Redirect to dashboard after successful save
      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string }; status?: number };
      };
      const message = error.response?.data?.message || "Failed to save theme";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while fetching existing theme
  if (isFetchingTheme) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#f7f9ff] via-white to-[#eef2ff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#203972] border-t-transparent" />
          <p className="text-sm text-slate-600">
            Loading theme configuration...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f7f9ff] via-white to-[#eef2ff] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <header className="mb-6 rounded-2xl border border-[#e5e9f5] bg-white/90 px-6 py-5 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#db1d34]">
                Barangay theming
              </p>
              <h1 className="text-2xl font-bold text-[#1a2e5a]">
                Theme Setup Wizard
              </h1>
              <p className="text-sm text-slate-600">
                Configure your portal look and feel. Tune colors, typography,
                and buttons to match your SK branding.
              </p>
              {error && (
                <p className="mt-2 rounded bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  {error}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  onClick={saveTheme}
                  disabled={isLoading || !barangayId}
                  className="rounded-lg bg-[#203972] px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#1a2e5a] disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Theme"}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_1.35fr]">
          <ThemePreview config={config} />

          <div className="space-y-6">
            <ColorSection colors={config.colors} onChange={handleColorChange} />
            <TypographySection
              headingFonts={headingFonts}
              bodyFonts={bodyFonts}
              typography={config.typography}
              onChange={handleTypographyChange}
            />
            <ButtonStyleSection
              buttons={config.buttons}
              onChange={handleButtonChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
