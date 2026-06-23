import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { getNavItems } from '@/lib/auth/permissions';
import type { UserRecord } from '@/lib/db/schema/user';

type SiteHeaderProps = {
  currentUser: UserRecord;
};

export function SiteHeader({ currentUser }: SiteHeaderProps) {
  const navItems = getNavItems(currentUser);

  return (
    <header className="site-header" aria-label="サイトヘッダー">
      <Container className="site-header-inner">
        <Link href="/" className="site-logo">
          Digital Creator Market
        </Link>
        <nav aria-label="主要ナビゲーション" className="site-nav">
          {navItems.map((item) => (
            <Link key={`${item.href}-${item.label}`} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
