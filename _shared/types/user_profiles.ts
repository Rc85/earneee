export interface UserProfilesInterface {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  country: string;
  postalCode: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string | null;
}
