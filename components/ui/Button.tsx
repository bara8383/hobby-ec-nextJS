import Link from 'next/link';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  className?: string;
};

const variantClassMap: Record<ButtonVariant, string> = {
  primary: 'ui-button--primary',
  secondary: 'ui-button--secondary',
  ghost: 'ui-button--ghost',
  destructive: 'ui-button--destructive',
  link: 'ui-button--link'
};

export function Button({ className, variant = 'primary', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn('ui-button', variantClassMap[variant], className)} {...props} />;
}

export function ButtonLink({ className, variant = 'primary', ...props }: ButtonLinkProps) {
  return <Link className={cn('ui-button', variantClassMap[variant], className)} {...props} />;
}
