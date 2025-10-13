export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export interface BookingRequestData {
  propertyId: string;
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
}