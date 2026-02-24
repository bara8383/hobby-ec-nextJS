import type { UserRecord, UserRole } from '@/lib/db/schema/user';

export type SiteNavItem = {
  href: string;
  label: string;
};

export function isGuest(user: UserRecord) {
  return user.roles.length === 0;
}

export function hasRole(user: UserRecord, role: UserRole) {
  return user.roles.includes(role);
}

export function isAdmin(user: UserRecord) {
  return hasRole(user, 'admin');
}

export function canViewOrders(user: UserRecord) {
  return hasRole(user, 'buyer') && !isAdmin(user);
}

export function canSell(user: UserRecord) {
  return hasRole(user, 'seller') && !isAdmin(user);
}

export function getNavItems(user: UserRecord): SiteNavItem[] {
  const items: SiteNavItem[] = [
    { href: '/', label: 'ホーム' }
  ];

  if (isAdmin(user)) {
    return [
      ...items,
      { href: '/chat', label: 'チャット' },
      { href: '/mypage/settings', label: 'マイページ' }
    ];
  }

  if (isGuest(user)) {
    return [
      ...items,
      { href: '/chat', label: 'チャット' },
      { href: '/login', label: 'マイページ（ログイン）' }
    ];
  }

  if (canViewOrders(user)) {
    items.push({ href: '/mypage/orders', label: '注文履歴' });
  }

  if (canSell(user)) {
    const sellerLabel = hasRole(user, 'buyer') ? '出品履歴' : '出品管理';
    items.push({ href: '/seller', label: sellerLabel });
  }

  items.push({ href: '/chat', label: 'チャット' });
  items.push({ href: '/mypage/settings', label: 'マイページ' });

  return items;
}
