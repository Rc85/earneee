export interface UserMessagesInterface {
  id: string;
  userId: string;
  from: string | null;
  type: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}
