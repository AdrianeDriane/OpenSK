import type {
  ThemeButtonStyle,
  ThemeButtonVariant,
  ThemeButtonsConfig,
} from "../../types/theme";

interface ButtonStyleSectionProps {
  buttons: ThemeButtonsConfig;
  onChange: <K extends keyof ThemeButtonStyle>(
    role: keyof ThemeButtonsConfig,
    key: K,
    value: ThemeButtonStyle[K]
  ) => void;
}

const NumberField = ({
  label,
  value,
  suffix,
  min = 0,
  max = 48,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-800">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-700"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
        />
        {suffix ? (
          <span className="text-xs text-slate-500">{suffix}</span>
        ) : null}
      </div>
    </div>
  );
};

const VariantButton = ({
  variant,
  active,
  onSelect,
}: {
  variant: ThemeButtonVariant;
  active: boolean;
  onSelect: (variant: ThemeButtonVariant) => void;
}) => {
  const label = variant.charAt(0).toUpperCase() + variant.slice(1);
  return (
    <button
      type="button"
      onClick={() => onSelect(variant)}
      className={`rounded-lg border px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-sm ${
        active
          ? "border-slate-800 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-800"
      }`}
    >
      {label}
    </button>
  );
};

export const ButtonStyleSection = ({
  buttons,
  onChange,
}: ButtonStyleSectionProps) => {
  const renderButtonCard = (
    label: string,
    role: keyof ThemeButtonsConfig,
    values: ThemeButtonStyle
  ) => (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <span className="text-xs font-medium text-slate-500">
          {values.variant}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 pb-4">
        {(["solid", "outline", "ghost"] as ThemeButtonVariant[]).map(
          (variant) => (
            <VariantButton
              key={variant}
              variant={variant}
              active={values.variant === variant}
              onSelect={(v) => onChange(role, "variant", v)}
            />
          )
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField
          label="Radius"
          value={values.borderRadius}
          suffix="px"
          min={0}
          max={32}
          step={1}
          onChange={(v) => onChange(role, "borderRadius", v)}
        />
        <NumberField
          label="Padding X"
          value={values.paddingX}
          suffix="px"
          min={8}
          max={36}
          step={1}
          onChange={(v) => onChange(role, "paddingX", v)}
        />
        <NumberField
          label="Padding Y"
          value={values.paddingY}
          suffix="px"
          min={6}
          max={28}
          step={1}
          onChange={(v) => onChange(role, "paddingY", v)}
        />
      </div>
    </div>
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Buttons</h2>
          <p className="text-sm text-slate-600">
            Tune radius, padding, and style variants.
          </p>
        </div>
        <span className="rounded-full border border-[#dbe3ff] bg-[#e7ecff] px-3 py-1 text-xs font-semibold text-[#203972]">
          CTAs
        </span>
      </div>

      <div className="grid gap-4">
        {renderButtonCard("Primary button", "primary", buttons.primary)}
        {renderButtonCard("Secondary button", "secondary", buttons.secondary)}
      </div>
    </section>
  );
};
