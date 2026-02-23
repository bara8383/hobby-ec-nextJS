import type { UserNotificationSettings, UserRecord } from '@/lib/db/schema/user';

const users: UserRecord[] = [
  {
    id: 'buyer-demo',
    email: 'buyer@example.com',
    roles: ['buyer'],
    displayName: 'Calm Buyer',
    profileBio: '静かな購買体験を重視するバイヤーです。',
    countryCode: 'JP',
    timezone: 'Asia/Tokyo',
    notifications: {
      emailOrderUpdates: true,
      emailProductNews: false,
      chatSupportNotifications: true
    },
    passwordUpdatedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'seller-demo',
    email: 'seller@example.com',
    roles: ['seller', 'buyer'],
    displayName: 'Studio Seller',
    profileBio: '壁紙とBGMを販売しています。',
    countryCode: 'JP',
    timezone: 'Asia/Tokyo',
    notifications: {
      emailOrderUpdates: true,
      emailProductNews: true,
      chatSupportNotifications: true
    },
    passwordUpdatedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'admin-demo',
    email: 'admin@example.com',
    roles: ['admin', 'seller', 'buyer'],
    displayName: 'Admin User',
    profileBio: '運営アカウント',
    countryCode: 'JP',
    timezone: 'Asia/Tokyo',
    notifications: {
      emailOrderUpdates: true,
      emailProductNews: true,
      chatSupportNotifications: true
    },
    passwordUpdatedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

function updateUser(id: string, update: Partial<UserRecord>) {
  const target = users.find((user) => user.id === id);
  if (!target) {
    return undefined;
  }

  Object.assign(target, update, { updatedAt: new Date().toISOString() });

  return target;
}

export function getUserById(id: string) {
  return users.find((user) => user.id === id);
}

export function listUsers() {
  return [...users];
}

export function updateUserProfile(
  id: string,
  profile: Pick<UserRecord, 'displayName' | 'profileBio' | 'countryCode' | 'timezone'>
) {
  return updateUser(id, profile);
}

export function updateUserNotifications(id: string, notifications: UserNotificationSettings) {
  return updateUser(id, { notifications });
}

export function updateUserPasswordTimestamp(id: string) {
  return updateUser(id, { passwordUpdatedAt: new Date().toISOString() });
}
