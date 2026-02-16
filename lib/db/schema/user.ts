export type UserRole = 'customer' | 'admin';

export type UserNotificationSettings = {
  emailOrderUpdates: boolean;
  emailProductNews: boolean;
  chatSupportNotifications: boolean;
};

export type UserRecord = {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  profileBio?: string;
  countryCode: string;
  timezone: string;
  notifications: UserNotificationSettings;
  passwordUpdatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};
