export interface FaqsInterface {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}
