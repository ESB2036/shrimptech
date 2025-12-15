export interface Customer {
  id: number;
  name: string;
  type: 'empresa' | 'negocio' | 'persona';
  ruc: string;
  phone: string;
  email: string;
  location: string;
  category: 'regular' | 'premium' | 'vip';
  creditLimit: number;
  paymentTerms: string;
  salesRepresentative: string;
  lastPurchase: Date | null;
  totalPurchases: number;
  notes: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface CustomerFormData {
  name: string;
  type: 'empresa' | 'negocio' | 'persona';
  ruc: string;
  phone: string;
  email: string;
  location: string;
  category: 'regular' | 'premium' | 'vip';
  creditLimit: number;
  paymentTerms: string;
  notes: string;
}