'use client';

import { FormEvent, useState } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus('idle');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      subject: String(formData.get('subject') ?? ''),
      message: String(formData.get('message') ?? '')
    };

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setStatus('error');
      setMessage(data.error ?? '送信に失敗しました。時間を置いて再度お試しください。');
      setLoading(false);
      return;
    }

    setStatus('success');
    setMessage('お問い合わせを受け付けました。通常1〜2営業日以内にご連絡します。');
    event.currentTarget.reset();
    setLoading(false);
  }

  return (
    <form className="settings-form" onSubmit={onSubmit}>
      <label>
        お名前
        <input name="name" type="text" minLength={1} maxLength={60} required />
      </label>
      <label>
        メール
        <input name="email" type="email" required />
      </label>
      <label>
        件名
        <input name="subject" type="text" minLength={1} maxLength={120} required />
      </label>
      <label>
        内容
        <textarea name="message" rows={6} minLength={5} maxLength={3000} required />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? '送信中...' : '送信する'}
      </button>
      {status !== 'idle' ? (
        <p className={status === 'success' ? 'settings-message success' : 'settings-message error'}>{message}</p>
      ) : null}
    </form>
  );
}
