function TitleBar({ title, variant }: { title: string; variant?: string }) {
  variant = variant || 'default';

  const variantStyles: {
    [key: string]: {
      foreground: string;
      background: string;
    };
  } = {
    default: {
      foreground: 'bg-brand-9',
      background: 'bg-brand-3',
    },
    grey: {
      foreground: 'bg-muted-foreground',
      background: 'bg-muted',
    },
  };

  return (
    <div
      className={` ${variantStyles[variant].background} flex w-full items-center justify-start space-x-3 rounded-md px-5 py-2`}
    >
      <div className={`${variantStyles[variant].foreground} size-2.5 rounded-full`} />
      <h3 className="text-primary text-base font-medium">{title}</h3>
    </div>
  );
}

export { TitleBar };
