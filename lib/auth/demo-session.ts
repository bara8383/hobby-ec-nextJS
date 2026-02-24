import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserById, listUsers } from '@/lib/db/repositories/user-repository';
import type { UserRecord, UserRole } from '@/lib/db/schema/user';

export const DEMO_AUTH_COOKIE = 'demo_account_id';

export async function getCurrentUser(): Promise<UserRecord> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(DEMO_AUTH_COOKIE)?.value;

  if (!userId) {
    return getUserById('guest') ?? listUsers()[0];
  }

  return getUserById(userId) ?? getUserById('guest') ?? listUsers()[0];
}

export async function requireRole(role: UserRole, redirectPath = '/login') {
  const user = await getCurrentUser();
  if (!user.roles.includes(role)) {
    redirect(`${redirectPath}?next=/${role}`);
  }

  return user;
}
