export type UserRole = 'buyer' | 'seller' | 'admin';

export type UserNotificationSettings = {
  emailOrderUpdates: boolean;
  emailProductNews: boolean;
  chatSupportNotifications: boolean;
};

export type UserRecord = {
  id: string;
  email: string;
  roles: UserRole[];
  displayName: string;
  profileBio?: string;
  countryCode: string;
  timezone: string;
  notifications: UserNotificationSettings;
  passwordUpdatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};
