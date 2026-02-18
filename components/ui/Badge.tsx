import { cn } from '@/lib/cn';

type BadgeVariant = 'default' | 'accent' | 'success' | 'danger' | 'muted';

const variantMap: Record<BadgeVariant, string> = {
  default: 'ui-badge--default',
  accent: 'ui-badge--accent',
  success: 'ui-badge--success',
  danger: 'ui-badge--danger',
  muted: 'ui-badge--muted'
};

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return <span className={cn('ui-badge', variantMap[variant], className)} {...props} />;
}
