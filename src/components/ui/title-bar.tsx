type TitleBarVariant = 'default' | 'grey' | 'accent';

function TitleBar({ title, variant = 'default' }: { title: string; variant?: TitleBarVariant }) {
  const variantStyles: Record<TitleBarVariant, { foreground: string; background: string }> = {
    default: {
      foreground: 'bg-brand-9',
      background: 'bg-brand-3',
    },
    grey: {
      foreground: 'bg-muted-foreground',
      background: 'bg-muted',
    },
    accent: {
      foreground: 'bg-amber-600',
      background: 'bg-amber-50',
    },
  };

  const style = variantStyles[variant] ?? variantStyles.default;

  return (
    <div
      className={`${style.background} flex w-full items-center justify-start space-x-3 rounded-md px-5 py-2`}
    >
      <div className={`${style.foreground} size-2.5 rounded-full`} />
      <h3 className="text-primary text-base font-medium">{title}</h3>
    </div>
  );
}

export { TitleBar };
