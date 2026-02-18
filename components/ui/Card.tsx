import { cn } from '@/lib/cn';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <article className={cn('ui-card', className)} {...props} />;
}
