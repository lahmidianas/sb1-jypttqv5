import { sendEmail } from './emailService';
import { formatDate } from '../utils/format';

interface BookingEmailData {
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  totalPrice: number;
}

export function createBookingRequestEmail(data: BookingEmailData) {
  return {
    to: 'yassirazami21@gmail.com',
    subject: `Nouvelle demande de réservation - ${data.propertyTitle}`,
    html: `
      <h2>Nouvelle demande de réservation</h2>
      <p><strong>Propriété:</strong> ${data.propertyTitle}</p>
      <p><strong>Dates:</strong> du ${formatDate(data.checkIn)} au ${formatDate(data.checkOut)}</p>
      <p><strong>Prix total:</strong> ${data.totalPrice}€</p>
      <h3>Informations client:</h3>
      <p><strong>Nom:</strong> ${data.clientName}</p>
      <p><strong>Email:</strong> ${data.clientEmail}</p>
      <p><strong>Téléphone:</strong> ${data.clientPhone}</p>
    `
  };
}

export async function sendBookingRequestEmail(data: BookingEmailData): Promise<boolean> {
  return sendEmail(createBookingRequestEmail(data));
}