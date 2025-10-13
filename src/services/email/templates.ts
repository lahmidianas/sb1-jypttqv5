import { BookingRequestData } from './types';

export function createBookingRequestEmail(data: BookingRequestData) {
  return {
    to: 'yassirazami21@gmail.com',
    subject: `Nouvelle demande de réservation - ${data.propertyTitle}`,
    html: `
      <h2>Nouvelle demande de réservation</h2>
      
      <h3>Informations du bien</h3>
      <p><strong>Propriété:</strong> ${data.propertyTitle}</p>
      <p><strong>ID:</strong> ${data.propertyId}</p>
      <p><strong>Dates souhaitées:</strong> du ${data.checkIn} au ${data.checkOut}</p>
      
      <h3>Informations client</h3>
      <p><strong>Nom:</strong> ${data.fullName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Téléphone:</strong> ${data.phone}</p>
      
      ${data.message ? `
        <h3>Message</h3>
        <p>${data.message}</p>
      ` : ''}
    `
  };
}