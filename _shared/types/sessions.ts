export interface SessionsInterface {
  id: string;
  userId: string;
  sessionId: string;
  ipAddress: string;
  application: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}
