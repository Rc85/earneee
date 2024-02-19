import { UserBansInterface, UserProfilesInterface } from '.';

export interface UsersInterface {
  id: string;
  email: string;
  password: string;
  isAdmin: boolean;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  profile?: UserProfilesInterface;
  ban?: UserBansInterface;
}
