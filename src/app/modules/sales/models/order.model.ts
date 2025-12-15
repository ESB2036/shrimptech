export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  customerId: number;
  customerName: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryDate: Date | null;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  invoiceNumber: string | null;
  notes: string;
  suggestion: string | null;
}

export interface OrderFormData {
  customerId: number;
  items: OrderItem[];
  notes: string;
}