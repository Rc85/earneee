export interface UserProfilesInterface {
  id: string;
  firstName: string | null;
  lastName: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  country: string;
  postalCode: string | null;
  phoneNumber: string | null;
  logoUrl: string | null;
  logoPath: string | null;
  createdAt: string;
  updatedAt: string | null;
  email?: string;
}
