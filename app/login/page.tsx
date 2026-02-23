import type { Metadata } from 'next';
import { listUsers } from '@/lib/db/repositories/user-repository';
import { loginDemoAction } from '@/app/login/actions';

export const metadata: Metadata = {
  title: 'デモログイン',
  description: 'E2E検証向けに、購入者・出品者・管理者を切り替えてログインします。',
  robots: { index: false, follow: false },
  alternates: { canonical: '/login' }
};

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string; status?: string }>;
}) {
  const params = await searchParams;
  const users = listUsers();

  return (
    <main>
      <h1>デモログイン</h1>
      <p>検証したい役割を選択してログインしてください。</p>
      {params.status === 'error' ? <p className="chat-error">ユーザー選択が無効です。</p> : null}
      <form action={loginDemoAction} className="settings-form" style={{ maxWidth: 420 }}>
        <input type="hidden" name="next" value={params.next ?? '/'} />
        <label>
          アカウント
          <select name="userId" required defaultValue={users[0]?.id}>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.displayName} ({user.roles.join(', ')})
              </option>
            ))}
          </select>
        </label>
        <button type="submit">ログインする</button>
      </form>
    </main>
  );
}
