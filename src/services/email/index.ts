import { supabase } from '../../lib/supabase';
import { EmailData, BookingRequestData } from './types';
import { createBookingRequestEmail } from './templates';

export async function sendBookingRequestEmail(data: EmailData): Promise<boolean> {
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

export async function sendBookingRequest(data: BookingRequestData): Promise<boolean> {
  const emailData = createBookingRequestEmail(data);
  return sendEmail(emailData);
}