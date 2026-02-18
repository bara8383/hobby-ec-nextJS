import { NextResponse } from 'next/server';

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json()) as ContactPayload;

  const name = body.name?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const subject = body.subject?.trim() ?? '';
  const message = body.message?.trim() ?? '';

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: '必須項目を入力してください。' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'メールアドレスの形式が不正です。' }, { status: 400 });
  }

  console.info('contact-received', {
    name,
    email,
    subject,
    message,
    receivedAt: new Date().toISOString()
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
