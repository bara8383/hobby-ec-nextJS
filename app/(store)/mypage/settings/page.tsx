import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/demo-session';
import {
  updateNotificationsAction,
  updatePasswordAction,
  updateProfileAction
} from '@/app/(store)/mypage/settings/actions';

export const metadata: Metadata = {
  title: 'アカウント設定',
  description: 'プロフィール・通知・セキュリティ設定を管理するマイページです。',
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: '/mypage/settings'
  }
};

type SearchParams = {
  section?: string;
  status?: 'success' | 'error';
};

function getProfileCompletion(user: Awaited<ReturnType<typeof getCurrentUser>>) {
  const checks = [
    Boolean(user.displayName.trim()),
    Boolean(user.profileBio?.trim()),
    Boolean(user.countryCode.trim()),
    Boolean(user.timezone.trim())
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function StatusMessage({ section, status }: SearchParams) {
  if (!section || !status) {
    return null;
  }

  const map: Record<string, string> = {
    profile: 'プロフィール設定',
    notifications: '通知設定',
    security: 'セキュリティ設定'
  };

  const title = map[section] ?? '設定';

  return (
    <p className={status === 'success' ? 'settings-message success' : 'settings-message error'}>
      {status === 'success'
        ? `${title}を更新しました。`
        : `${title}の入力内容を確認してください。`}
    </p>
  );
}

export default async function AccountSettingsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const user = await getCurrentUser();
  const profileCompletion = getProfileCompletion(user);
  const enabledNotificationCount = Object.values(user.notifications).filter(Boolean).length;
  const securityLabel = user.passwordUpdatedAt
    ? `${new Date(user.passwordUpdatedAt).toLocaleDateString('ja-JP')} に更新`
    : '未設定';

  if (!user) {
    return (
      <main>
        <h1>アカウント設定</h1>
        <p>ユーザー情報の取得に失敗しました。時間を置いて再度お試しください。</p>
      </main>
    );
  }

  return (
    <main>
      <nav className="breadcrumb" aria-label="パンくず">
        <Link href="/">ホーム</Link> / <span>アカウント設定</span>
      </nav>

      <section className="account-hero" aria-labelledby="account-hero-title">
        <div>
          <p className="account-hero-kicker">My Account</p>
          <h1 id="account-hero-title">{user.displayName}さんのアカウント設定</h1>
          <p className="section-description">
            Amazon・楽天など主要ECの「すぐ探せる・迷わない設定導線」を参考に、プロフィール / 通知 /
            セキュリティを1ページで管理できるよう整理しています。
          </p>
        </div>
        <div className="account-health-grid" aria-label="アカウント状態サマリー">
          <article className="account-health-card">
            <p className="account-health-label">プロフィール充実度</p>
            <p className="account-health-value">{profileCompletion}%</p>
            <p className="account-health-meta">購入体験の最適化に必要な情報入力率</p>
          </article>
          <article className="account-health-card">
            <p className="account-health-label">有効な通知チャネル</p>
            <p className="account-health-value">{enabledNotificationCount} / 3</p>
            <p className="account-health-meta">配送・サポートの取りこぼし防止に活用</p>
          </article>
          <article className="account-health-card">
            <p className="account-health-label">パスワード更新状況</p>
            <p className="account-health-value account-health-value-small">{securityLabel}</p>
            <p className="account-health-meta">定期更新で不正ログイン対策を強化</p>
          </article>
        </div>
      </section>

      <section className="account-shortcuts" aria-label="マイページのショートカット">
        <Link href="/mypage/orders" className="account-shortcut-card">
          <h2>注文履歴を確認</h2>
          <p>配送状況・領収書・再購入をここからすぐに操作できます。</p>
        </Link>
        <Link href="/mypage/library" className="account-shortcut-card">
          <h2>購入済みコンテンツ</h2>
          <p>デジタル商品のダウンロード再取得と再生確認に移動します。</p>
        </Link>
        <Link href="/help" className="account-shortcut-card">
          <h2>サポート・FAQ</h2>
          <p>設定で不明点がある場合の問い合わせ導線です。</p>
        </Link>
      </section>

      <StatusMessage section={resolvedSearchParams.section} status={resolvedSearchParams.status} />

      <div className="settings-grid">
        <section className="settings-card" id="profile-settings" aria-labelledby="profile-settings-heading">
          <h2 id="profile-settings-heading">プロフィール</h2>
          <p>表示名、自己紹介、居住国、タイムゾーンを更新します。</p>
          <form action={updateProfileAction} className="settings-form">
            <label>
              表示名
              <input
                name="displayName"
                type="text"
                defaultValue={user.displayName}
                minLength={1}
                maxLength={40}
                required
              />
            </label>
            <label>
              自己紹介
              <textarea name="profileBio" defaultValue={user.profileBio} maxLength={200} rows={4} />
            </label>
            <label>
              居住国（ISO 2桁）
              <input
                name="countryCode"
                type="text"
                defaultValue={user.countryCode}
                pattern="[A-Za-z]{2}"
                minLength={2}
                maxLength={2}
                required
              />
            </label>
            <label>
              タイムゾーン
              <select name="timezone" defaultValue={user.timezone} required>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </label>
            <button type="submit" className="ui-button ui-button--primary">プロフィールを保存</button>
          </form>
        </section>

        <section
          className="settings-card"
          id="notification-settings"
          aria-labelledby="notification-settings-heading"
        >
          <h2 id="notification-settings-heading">通知設定</h2>
          <p>注文状況や新着商品の配信通知を制御します。</p>
          <form action={updateNotificationsAction} className="settings-form">
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="emailOrderUpdates"
                defaultChecked={user.notifications.emailOrderUpdates}
              />
              注文ステータス更新をメールで受け取る
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="emailProductNews"
                defaultChecked={user.notifications.emailProductNews}
              />
              新着商品・セール情報をメールで受け取る
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="chatSupportNotifications"
                defaultChecked={user.notifications.chatSupportNotifications}
              />
              チャットサポート返信通知を受け取る
            </label>
            <button type="submit" className="ui-button ui-button--primary">通知設定を保存</button>
          </form>
        </section>

        <section className="settings-card" id="security-settings" aria-labelledby="security-settings-heading">
          <h2 id="security-settings-heading">セキュリティ</h2>
          <p>
            現在のパスワードを確認したうえで、8文字以上の新しいパスワードへ変更します。最終変更日時:{' '}
            {user.passwordUpdatedAt
              ? new Date(user.passwordUpdatedAt).toLocaleString('ja-JP')
              : '未設定'}
          </p>
          <form action={updatePasswordAction} className="settings-form">
            <label>
              現在のパスワード
              <input name="currentPassword" type="password" minLength={1} required />
            </label>
            <label>
              新しいパスワード
              <input name="nextPassword" type="password" minLength={8} required />
            </label>
            <label>
              新しいパスワード（確認）
              <input name="confirmPassword" type="password" minLength={8} required />
            </label>
            <button type="submit" className="ui-button ui-button--primary">パスワードを更新</button>
          </form>
        </section>
      </div>
    </main>
  );
}
