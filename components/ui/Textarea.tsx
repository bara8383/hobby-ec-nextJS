import { cn } from '@/lib/cn';

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('ui-textarea', className)} {...props} />;
}
