export type BookingStatus = 'waiting' | 'confirmed';

export interface Booking {
  id: string;
  property_id: string;
  client_id: string;
  check_in: string;
  check_out: string;
  status: BookingStatus;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  propertyId: string;
  clientId: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
}