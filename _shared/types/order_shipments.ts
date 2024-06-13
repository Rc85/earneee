export interface OrderShipmentsInterface {
  id: string;
  orderId: string;
  shippingProvider: string | null;
  trackingNumber: string | null;
  address: string | null;
  addressLine2: string | null;
  city: string | null;
  region: string | null;
  country: string;
  postalCode: string | null;
  eta: string | null;
  createdAt: string;
  updatedAt: string | null;
}
