import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import { Customer, CustomerFormData } from '../models/customer.model';
import { Order, OrderFormData } from '../models/order.model';
import { MonthlySales, TopClient, SalesFilter } from '../models/sales-report.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'api';
  
  private customers: Customer[] = [
    {
      id: 1,
      name: 'Acuícola del Pacífico S.A.',
      type: 'empresa',
      ruc: '1798765432001',
      phone: '099-875-4123',
      email: 'ventas@acuipacifico.com',
      location: 'Guayaquil, Ecuador',
      category: 'premium',
      creditLimit: 50000,
      paymentTerms: '30 días',
      salesRepresentative: 'María González',
      lastPurchase: new Date('2024-01-15'),
      totalPurchases: 68500,
      notes: 'Cliente preferencial, paga puntualmente',
      status: 'active',
      createdAt: new Date('2023-05-10')
    },
    {
      id: 2,
      name: 'Mariscos del Litoral',
      type: 'negocio',
      ruc: '0908765432',
      phone: '098-123-4567',
      email: 'mariscos@litoral.ec',
      location: 'Manta, Ecuador',
      category: 'premium',
      creditLimit: 30000,
      paymentTerms: '15 días',
      salesRepresentative: 'Carlos Ruiz',
      lastPurchase: new Date('2024-01-10'),
      totalPurchases: 42100,
      notes: 'Pide productos premium regularmente',
      status: 'active',
      createdAt: new Date('2023-06-15')
    },
    {
      id: 3,
      name: 'ExportCam Ecuador',
      type: 'empresa',
      ruc: '1798123456001',
      phone: '097-654-3210',
      email: 'contacto@exportcam.ec',
      location: 'Quito, Ecuador',
      category: 'vip',
      creditLimit: 100000,
      paymentTerms: '60 días',
      salesRepresentative: 'Ana Martínez',
      lastPurchase: new Date('2024-01-05'),
      totalPurchases: 35800,
      notes: 'Mayor exportador, necesita factura electrónica',
      status: 'active',
      createdAt: new Date('2023-04-20')
    }
  ];

  private orders: Order[] = [
    {
      id: '#1001',
      customerId: 1,
      customerName: 'Acuícola del Pacífico S.A.',
      status: 'pending',
      orderDate: new Date(),
      deliveryDate: null,
      items: [
        { productId: 1, productName: 'Camarón 30/40', quantity: 500, unitPrice: 15, total: 7500 },
        { productId: 2, productName: 'Camarón 40/50', quantity: 200, unitPrice: 5, total: 1000 }
      ],
      subtotal: 8500,
      tax: 1020,
      total: 9520,
      invoiceNumber: null,
      notes: 'Urgente para exportación',
      suggestion: 'Verificar stock antes de confirmar'
    },
    {
      id: '#1002',
      customerId: 2,
      customerName: 'Mariscos del Litoral',
      status: 'delivered',
      orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      deliveryDate: new Date(),
      items: [
        { productId: 3, productName: 'Camarón 20/30', quantity: 300, unitPrice: 17.33, total: 5200 }
      ],
      subtotal: 5200,
      tax: 624,
      total: 5824,
      invoiceNumber: 'FAC-2025-0891',
      notes: 'Entregado en bodega principal',
      suggestion: null
    }
  ];

  // Subjects para estado reactivo
  private customersSubject = new BehaviorSubject<Customer[]>(this.customers);
  private ordersSubject = new BehaviorSubject<Order[]>(this.orders);

  customers$ = this.customersSubject.asObservable();
  orders$ = this.ordersSubject.asObservable();

  constructor() {}

  // ========== CLIENTES ==========
  getCustomers(): Observable<Customer[]> {
    return this.customers$.pipe(delay(500));
  }

  getCustomer(id: number): Observable<Customer | undefined> {
    return this.customers$.pipe(
      map(customers => customers.find(c => c.id === id)),
      delay(300)
    );
  }

  addCustomer(customerData: CustomerFormData): Observable<Customer> {
    const newCustomer: Customer = {
      id: Math.max(...this.customers.map(c => c.id)) + 1,
      ...customerData,
      salesRepresentative: 'Sin asignar',
      lastPurchase: null,
      totalPurchases: 0,
      status: 'active',
      createdAt: new Date()
    };

    this.customers = [...this.customers, newCustomer];
    this.customersSubject.next(this.customers);
    
    return of(newCustomer).pipe(delay(800));
  }

  updateCustomer(id: number, customerData: Partial<Customer>): Observable<Customer> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }

    this.customers[index] = { ...this.customers[index], ...customerData };
    this.customersSubject.next([...this.customers]);
    
    return of(this.customers[index]).pipe(delay(800));
  }

  deleteCustomer(id: number): Observable<void> {
    this.customers = this.customers.filter(c => c.id !== id);
    this.customersSubject.next(this.customers);
    
    this.orders = this.orders.filter(o => o.customerId !== id);
    this.ordersSubject.next(this.orders);
    
    return of(void 0).pipe(delay(500));
  }

  // ========== PEDIDOS ==========
  getOrders(status?: string): Observable<Order[]> {
    return this.orders$.pipe(
      map(orders => status ? orders.filter(o => o.status === status) : orders),
      delay(500)
    );
  }

  getOrder(id: string): Observable<Order | undefined> {
    return this.orders$.pipe(
      map(orders => orders.find(o => o.id === id)),
      delay(300)
    );
  }

  createOrder(orderData: OrderFormData): Observable<Order> {
    const customer = this.customers.find(c => c.id === orderData.customerId);
    if (!customer) {
      throw new Error('Cliente no encontrado');
    }

    const subtotal = orderData.items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.15; 
    const total = subtotal + tax;

    const newOrder: Order = {
      id: `#${1000 + this.orders.length + 1}`,
      customerId: orderData.customerId,
      customerName: customer.name,
      status: 'pending',
      orderDate: new Date(),
      deliveryDate: null,
      items: orderData.items,
      subtotal,
      tax,
      total,
      invoiceNumber: null,
      notes: orderData.notes,
      suggestion: 'Revisar disponibilidad de productos'
    };

    this.orders = [...this.orders, newOrder];
    this.ordersSubject.next(this.orders);
    
    // Actualizar total de compras del cliente
    this.updateCustomerPurchase(customer.id, total);
    
    return of(newOrder).pipe(delay(800));
  }

  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order> {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    order.status = status;
    
    if (status === 'delivered' && !order.invoiceNumber) {
      order.invoiceNumber = `FAC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      order.deliveryDate = new Date();
    }

    this.ordersSubject.next([...this.orders]);
    
    return of(order).pipe(delay(500));
  }

  generateInvoice(orderId: string): Observable<Order> {
    return this.updateOrderStatus(orderId, 'delivered');
  }

  // ========== REPORTES ==========
  getMonthlySales(): Observable<MonthlySales[]> {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    return of(
      months.map((month, index) => ({
        month,
        year: 2025,
        sales: [65, 75, 70, 82, 92, 100][index] * 1000,
        growth: [5, 15, 8, 17, 25, 48][index]
      }))
    ).pipe(delay(600));
  }

  getTopClients(limit: number = 5): Observable<TopClient[]> {
    return this.customers$.pipe(
      map(customers => 
        customers
          .filter(c => c.totalPurchases > 0)
          .sort((a, b) => b.totalPurchases - a.totalPurchases)
          .slice(0, limit)
          .map(c => ({
            id: c.id,
            name: c.name,
            totalPurchases: c.totalPurchases,
            percentage: (c.totalPurchases / this.customers.reduce((sum, cust) => sum + cust.totalPurchases, 0)) * 100
          }))
      ),
      delay(500)
    );
  }

  getSalesStats(): Observable<{totalSales: number, activeCustomers: number, pendingOrders: number}> {
    return this.orders$.pipe(
      map(orders => {
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        
        return {
          totalSales,
          activeCustomers: this.customers.length,
          pendingOrders
        };
      }),
      delay(300)
    );
  }

  // ========== MÉTODOS PRIVADOS ==========
  private updateCustomerPurchase(customerId: number, amount: number): void {
    const customer = this.customers.find(c => c.id === customerId);
    if (customer) {
      customer.totalPurchases += amount;
      customer.lastPurchase = new Date();
      this.customersSubject.next([...this.customers]);
    }
  }
}