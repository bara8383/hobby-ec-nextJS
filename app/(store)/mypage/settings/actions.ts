'use server';

import { redirect } from 'next/navigation';
import {
  updateUserNotifications,
  updateUserPasswordTimestamp,
  updateUserProfile
} from '@/lib/db/repositories/user-repository';
import { getCurrentUser } from '@/lib/auth/demo-session';

const SETTINGS_PATH = '/mypage/settings';


function normalizeCheckbox(value: FormDataEntryValue | null) {
  return value === 'on';
}

export async function updateProfileAction(formData: FormData) {
  const displayName = String(formData.get('displayName') ?? '').trim();
  const profileBio = String(formData.get('profileBio') ?? '').trim();
  const countryCode = String(formData.get('countryCode') ?? '').trim().toUpperCase();
  const timezone = String(formData.get('timezone') ?? '').trim();

  if (!displayName || displayName.length > 40) {
    redirect(`${SETTINGS_PATH}?section=profile&status=error`);
  }

  if (profileBio.length > 200) {
    redirect(`${SETTINGS_PATH}?section=profile&status=error`);
  }

  if (!/^[A-Z]{2}$/.test(countryCode)) {
    redirect(`${SETTINGS_PATH}?section=profile&status=error`);
  }

  if (!timezone) {
    redirect(`${SETTINGS_PATH}?section=profile&status=error`);
  }

  const user = await getCurrentUser();
  updateUserProfile(user.id, {
    displayName,
    profileBio,
    countryCode,
    timezone
  });

  redirect(`${SETTINGS_PATH}?section=profile&status=success`);
}

export async function updateNotificationsAction(formData: FormData) {
  const user = await getCurrentUser();
  updateUserNotifications(user.id, {
    emailOrderUpdates: normalizeCheckbox(formData.get('emailOrderUpdates')),
    emailProductNews: normalizeCheckbox(formData.get('emailProductNews')),
    chatSupportNotifications: normalizeCheckbox(formData.get('chatSupportNotifications'))
  });

  redirect(`${SETTINGS_PATH}?section=notifications&status=success`);
}

export async function updatePasswordAction(formData: FormData) {
  const currentPassword = String(formData.get('currentPassword') ?? '').trim();
  const nextPassword = String(formData.get('nextPassword') ?? '').trim();
  const confirmPassword = String(formData.get('confirmPassword') ?? '').trim();

  if (!currentPassword || nextPassword.length < 8 || nextPassword !== confirmPassword) {
    redirect(`${SETTINGS_PATH}?section=security&status=error`);
  }

  const user = await getCurrentUser();
  updateUserPasswordTimestamp(user.id);

  redirect(`${SETTINGS_PATH}?section=security&status=success`);
}
