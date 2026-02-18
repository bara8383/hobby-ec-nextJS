import { cn } from '@/lib/cn';

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  title?: string;
  description?: string;
};

export function Section({ className, title, description, children, ...props }: SectionProps) {
  return (
    <section className={cn('ui-section', className)} {...props}>
      {title ? <h1 className="ui-section-title">{title}</h1> : null}
      {description ? <p className="ui-section-description">{description}</p> : null}
      {children}
    </section>
  );
}
