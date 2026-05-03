import { GraduationCap } from 'lucide-react';

type BrandMarkProps = {
  className?: string;
  iconClassName?: string;
};

export function BrandMark({ className = 'w-7 h-7 rounded-lg bg-primary/10', iconClassName = 'h-4 w-4 text-primary' }: BrandMarkProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <GraduationCap className={iconClassName} />
    </div>
  );
}
