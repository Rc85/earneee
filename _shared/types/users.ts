import { UserProfilesInterface } from '.';

export interface UsersInterface {
  id: string;
  email: string;
  password: string;
  isAdmin: boolean;
  status: string;
  bannedUntil: string | null;
  createdAt: string;
  updatedAt: string | null;
  profile?: UserProfilesInterface;
}
