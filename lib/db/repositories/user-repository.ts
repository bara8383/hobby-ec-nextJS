import type { UserRecord } from '@/lib/db/schema/user';

const users: UserRecord[] = [
  {
    id: 'user-demo',
    email: 'demo@example.com',
    role: 'customer',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'admin-demo',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  }
];

export function getUserById(id: string) {
  return users.find((user) => user.id === id);
}

export function listUsers() {
  return [...users];
}
