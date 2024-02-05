export interface OffersInterface {
  id: string;
  name: string;
  url: string;
  logoPath: string;
  logoUrl: string;
  logoWidth: number;
  logoHeight: number;
  ordinance: number;
  startDate: string | null;
  endDate: string | null;
  details: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}
