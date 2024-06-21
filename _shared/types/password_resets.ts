export interface PasswordResetsInterface {
  id: number;
  email: string;
  token: string;
  expireAt: string;
  createdAt: string;
  updatedAt: string | null;
}
