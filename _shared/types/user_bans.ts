export interface UserBansInterface {
  id: string;
  userId: string;
  bannedUntil: string;
  reason: string;
  createdAt: string;
  updatedAt: string | null;
}
