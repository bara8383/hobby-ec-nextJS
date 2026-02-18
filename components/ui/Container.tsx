import { cn } from '@/lib/cn';

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('ui-container', className)} {...props} />;
}
