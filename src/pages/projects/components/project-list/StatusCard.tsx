import { cn } from '@/lib/utils';

interface StatusItemProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  iconColor?: string;
}

export function StatusCard({ icon, label, count, iconColor }: StatusItemProps) {
  return (
    <div className="flex flex-col gap-3 px-6">
      <div className="flex items-center gap-2">
        <div className={cn('flex h-5 w-5 items-center justify-center', iconColor)}>{icon}</div>
        <span className="normal whitespace-nowrap">{label}</span>
      </div>
      <span className="h2-topic leading-none">{count.toLocaleString()}</span>
    </div>
  );
}
