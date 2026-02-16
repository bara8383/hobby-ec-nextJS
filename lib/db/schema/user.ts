export type UserRole = 'customer' | 'admin';

export type UserRecord = {
  id: string;
  email: string;
  role: UserRole;
};
