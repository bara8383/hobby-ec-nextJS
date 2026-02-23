'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DEMO_AUTH_COOKIE } from '@/lib/auth/demo-session';
import { getUserById } from '@/lib/db/repositories/user-repository';

export async function loginDemoAction(formData: FormData) {
  const userId = String(formData.get('userId') ?? '').trim();
  const next = String(formData.get('next') ?? '/').trim() || '/';

  if (!getUserById(userId)) {
    redirect('/login?status=error');
  }

  const cookieStore = await cookies();
  cookieStore.set(DEMO_AUTH_COOKIE, userId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    httpOnly: true
  });

  redirect(next.startsWith('/') ? next : '/');
}
