export interface AffiliatesInterface {
  id: string;
  name: string;
  url: string | null;
  managerUrl: string | null;
  logoUrl: string | null;
  logoPath: string | null;
  description: string | null;
  commissionRate: number | null;
  rateType: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}
