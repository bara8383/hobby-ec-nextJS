import type { UserRecord } from '@/lib/db/schema/user';

const users: UserRecord[] = [
  { id: 'user-demo', email: 'demo@example.com', role: 'customer' },
  { id: 'admin-demo', email: 'admin@example.com', role: 'admin' }
];

export function getUserById(id: string) {
  return users.find((user) => user.id === id);
}

export function listUsers() {
  return [...users];
}
