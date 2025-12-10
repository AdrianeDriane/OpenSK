import type { ThemeConfig } from "../../types/theme";

interface TypographySectionProps {
  typography: ThemeConfig["typography"];
  headingFonts: string[];
  bodyFonts: string[];
  onChange: (key: keyof ThemeConfig["typography"], value: string) => void;
}

const SelectField = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-800">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
          ▾
        </span>
      </div>
    </div>
  );
};

export const TypographySection = ({
  typography,
  headingFonts,
  bodyFonts,
  onChange,
}: TypographySectionProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Typography</h2>
          <p className="text-sm text-slate-600">
            Select Google Fonts for headings and body copy.
          </p>
        </div>
        <span className="rounded-full border border-[#dbe3ff] bg-[#e7ecff] px-3 py-1 text-xs font-semibold text-[#203972]">
          Readability
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Heading Font"
          value={typography.headingFont}
          options={headingFonts}
          onChange={(v) => onChange("headingFont", v)}
        />
        <SelectField
          label="Body Font"
          value={typography.bodyFont}
          options={bodyFonts}
          onChange={(v) => onChange("bodyFont", v)}
        />
      </div>
    </section>
  );
};
