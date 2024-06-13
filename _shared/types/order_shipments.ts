export interface OrderShipmentsInterface {
  id: string;
  shippingProvider: string | null;
  trackingNumber: string | null;
  suite: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  country: string;
  postalCode: string | null;
  phoneNumber: string | null;
  eta: string | null;
  createdAt: string;
  updatedAt: string | null;
}
