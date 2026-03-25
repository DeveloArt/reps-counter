import { Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ManualEntryProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  placeholder?: string;
}

export function ManualEntry({ value, onChange, label, placeholder }: ManualEntryProps) {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t('components.manualEntry.label');
  const resolvedPlaceholder = placeholder ?? t('components.manualEntry.placeholder');

  return (
    <div className="w-full space-y-2">
      <label className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Edit2 className="size-4" />
        {resolvedLabel}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        className="w-full rounded-xl border-border bg-card focus:border-primary focus:ring-primary h-14 text-lg font-medium px-4 placeholder:text-muted-foreground"
        placeholder={resolvedPlaceholder}
      />
    </div>
  );
}
