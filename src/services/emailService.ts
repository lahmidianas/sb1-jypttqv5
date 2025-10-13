import { supabase } from '../lib/supabase';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(data: EmailData): Promise<boolean> {
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