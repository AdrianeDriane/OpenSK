import type { ThemeConfig } from "../../types/theme";

interface ColorSectionProps {
  colors: ThemeConfig["colors"];
  onChange: (key: keyof ThemeConfig["colors"], value: string) => void;
}

const ColorInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-800">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-11 rounded-md border border-slate-200 bg-white shadow-sm"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
        />
      </div>
    </div>
  );
};

export const ColorSection = ({ colors, onChange }: ColorSectionProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Colors</h2>
          <p className="text-sm text-slate-600">
            Choose your primary palette for the portal.
          </p>
        </div>
        <span className="rounded-full border border-[#dbe3ff] bg-[#e7ecff] px-3 py-1 text-xs font-semibold text-[#203972]">
          Branding
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ColorInput
          label="Primary"
          value={colors.primary}
          onChange={(v) => onChange("primary", v)}
        />
        <ColorInput
          label="Secondary"
          value={colors.secondary}
          onChange={(v) => onChange("secondary", v)}
        />
        <ColorInput
          label="Accent"
          value={colors.accent}
          onChange={(v) => onChange("accent", v)}
        />
        <ColorInput
          label="Background"
          value={colors.background}
          onChange={(v) => onChange("background", v)}
        />
      </div>
    </section>
  );
};
