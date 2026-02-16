import type { UserNotificationSettings, UserRecord } from '@/lib/db/schema/user';

const users: UserRecord[] = [
  {
    id: 'user-demo',
    email: 'demo@example.com',
    role: 'customer',
    displayName: 'Demo User',
    profileBio: '素材制作と配信を両立するクリエイターです。',
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
    id: 'admin-demo',
    email: 'admin@example.com',
    role: 'admin',
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
