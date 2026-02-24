import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { getNavItems, isGuest } from '@/lib/auth/permissions';
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
      <Container>
        <p className="hero-label" style={{ marginBottom: '0.5rem' }}>
          ログイン中: {currentUser.displayName} / 権限:{' '}
          {isGuest(currentUser) ? 'guest' : currentUser.roles.join(', ')}
        </p>
      </Container>
    </header>
  );
}
