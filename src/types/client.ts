export interface Client {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientFormData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ClientFormErrors {
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  submit?: string;
}