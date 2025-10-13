import { supabase } from './supabase';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(data: EmailData) {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: JSON.stringify(data)
    });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
}

export function createBookingRequestEmail(bookingData: {
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  totalPrice: number;
}) {
  const { propertyTitle, checkIn, checkOut, clientName, clientEmail, clientPhone, totalPrice } = bookingData;
  
  return {
    to: 'yassirazami21@gmail.com',
    subject: `Nouvelle demande de réservation - ${propertyTitle}`,
    html: `
      <h2>Nouvelle demande de réservation</h2>
      <p><strong>Propriété:</strong> ${propertyTitle}</p>
      <p><strong>Dates:</strong> du ${new Date(checkIn).toLocaleDateString('fr-FR')} au ${new Date(checkOut).toLocaleDateString('fr-FR')}</p>
      <p><strong>Prix total:</strong> ${totalPrice}€</p>
      <h3>Informations client:</h3>
      <p><strong>Nom:</strong> ${clientName}</p>
      <p><strong>Email:</strong> ${clientEmail}</p>
      <p><strong>Téléphone:</strong> ${clientPhone}</p>
    `
  };
}