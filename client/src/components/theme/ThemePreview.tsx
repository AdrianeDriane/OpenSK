import type { ThemeButtonsConfig, ThemeConfig } from "../../types/theme";

interface ThemePreviewProps {
  config: ThemeConfig;
}

const getButtonVisual = (
  config: ThemeConfig,
  role: keyof ThemeButtonsConfig,
  colorOverride?: string
) => {
  const button = config.buttons[role];
  const color =
    colorOverride ||
    (role === "primary" ? config.colors.primary : config.colors.secondary);
  const base = "transition font-semibold shadow-sm hover:shadow-md";
  const style = {
    borderRadius: `${button.borderRadius}px`,
    paddingLeft: `${button.paddingX}px`,
    paddingRight: `${button.paddingX}px`,
    paddingTop: `${button.paddingY}px`,
    paddingBottom: `${button.paddingY}px`,
  } as const;

  if (button.variant === "outline") {
    return {
      className: `${base} border bg-transparent hover:-translate-y-0.5`,
      style: {
        ...style,
        borderColor: color,
        color,
        backgroundColor: "transparent",
      },
      hoverStyle: {
        backgroundColor: color,
        color: "#ffffff",
      },
    } as const;
  }

  if (button.variant === "ghost") {
    return {
      className: `${base} bg-transparent hover:-translate-y-0.5`,
      style: {
        ...style,
        color,
        backgroundColor: "transparent",
      },
      hoverStyle: {
        backgroundColor: `${color}1a`,
      },
    } as const;
  }

  return {
    className: `${base} hover:-translate-y-0.5`,
    style: {
      ...style,
      backgroundColor: color,
      color: "#ffffff",
      border: "none",
    },
    hoverStyle: {},
  } as const;
};

export const ThemePreview = ({ config }: ThemePreviewProps) => {
  const primaryButton = getButtonVisual(config, "primary");
  const secondaryButton = getButtonVisual(config, "secondary");

  return (
    <aside className="w-full rounded-2xl border border-[#dfe6f5] bg-white p-6 shadow-sm lg:sticky lg:top-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#1a2e5a]">Live Preview</h2>
          <p className="text-sm text-slate-600">
            Instant preview as you tweak settings.
          </p>
        </div>
      </div>

      <div
        className="rounded-xl border border-slate-100 shadow-inner"
        style={{
          backgroundColor: config.colors.background,
          fontFamily: config.typography.bodyFont,
        }}
      >
        <div className="space-y-4 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Portal heading
          </p>
          <h3
            className="text-2xl font-semibold text-slate-900"
            style={{
              fontFamily: config.typography.headingFont,
              color: config.colors.primary,
            }}
          >
            Barangay Services Portal
          </h3>
          <p
            className="text-sm text-slate-700"
            style={{ color: config.colors.secondary }}
          >
            Empowering SK officials with streamlined document requests,
            announcements, and community updates.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              className={primaryButton.className}
              style={primaryButton.style}
              onMouseEnter={(e) => {
                if (primaryButton.hoverStyle.backgroundColor) {
                  e.currentTarget.style.backgroundColor =
                    primaryButton.hoverStyle.backgroundColor;
                }
                if (primaryButton.hoverStyle.color) {
                  e.currentTarget.style.color = primaryButton.hoverStyle.color;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  primaryButton.style.backgroundColor || "";
                e.currentTarget.style.color = primaryButton.style.color || "";
              }}
            >
              Primary Action
            </button>
            <button
              type="button"
              className={secondaryButton.className}
              style={secondaryButton.style}
              onMouseEnter={(e) => {
                if (secondaryButton.hoverStyle.backgroundColor) {
                  e.currentTarget.style.backgroundColor =
                    secondaryButton.hoverStyle.backgroundColor;
                }
                if (secondaryButton.hoverStyle.color) {
                  e.currentTarget.style.color =
                    secondaryButton.hoverStyle.color;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  secondaryButton.style.backgroundColor || "";
                e.currentTarget.style.color = secondaryButton.style.color || "";
              }}
            >
              Secondary Action
            </button>
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
              style={{ color: config.colors.accent }}
            >
              Ghost Link
            </button>
          </div>

          <div className="mt-4 rounded-lg border border-slate-100 bg-white/80 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Cards
            </p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {["Citizen Requests", "Barangay Updates"].map((title) => (
                <div
                  key={title}
                  className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm"
                  style={{ borderColor: `${config.colors.primary}1a` }}
                >
                  <p className="text-xs text-slate-500">Preview</p>
                  <p
                    className="text-sm font-semibold text-slate-900"
                    style={{ color: config.colors.primary }}
                  >
                    {title}
                  </p>
                  <p className="text-xs text-slate-600">
                    Example content using your selected fonts and accent colors.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
