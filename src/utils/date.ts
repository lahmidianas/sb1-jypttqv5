import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDisplayDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: fr });
}

export function formatISODate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
}

export function parseFrenchDate(dateStr: string): Date {
  return parse(dateStr, 'dd/MM/yyyy', new Date());
}