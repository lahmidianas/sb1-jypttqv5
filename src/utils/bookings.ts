import { supabase } from '../lib/supabase';

export async function calculateTotalPrice(
  propertyId: string,
  checkIn: string,
  checkOut: string
): Promise<number> {
  // Récupérer le prix de la propriété
  const { data: property, error } = await supabase
    .from('properties')
    .select('price')
    .eq('id', propertyId)
    .single();

  if (error || !property) {
    throw new Error('Property not found');
  }

  // Calculer le nombre de nuits
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  // Calculer le prix total
  return property.price * nights;
}