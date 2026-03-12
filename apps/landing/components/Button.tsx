import type { ButtonProps } from '@/types';

export function Button({ href, variant, children }: ButtonProps) {
  const baseClasses = 'px-8 py-3 rounded-lg font-semibold transition';
  const variantClasses =
    variant === 'primary'
      ? 'bg-teal-600 text-white hover:bg-teal-700'
      : 'border border-teal-600 text-teal-600 hover:bg-teal-50';

  return (
    <a href={href} className={`${baseClasses} ${variantClasses}`}>
      {children}
    </a>
  );
}
