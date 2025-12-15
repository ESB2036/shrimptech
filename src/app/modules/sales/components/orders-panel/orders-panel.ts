import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces locales
interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Order {
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

interface Customer {
  id: number;
  name: string;
  ruc: string;
}

@Component({
  selector: 'app-orders-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-panel.html',
  styleUrl: './orders-panel.css'
})
export class OrdersPanel {
  orders: Order[] = [
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
  
  filteredOrders: Order[] = [...this.orders];
  customers: Customer[] = [
    { id: 1, name: 'Acuícola del Pacífico S.A.', ruc: '1798765432001' },
    { id: 2, name: 'Mariscos del Litoral', ruc: '0908765432' },
    { id: 3, name: 'ExportCam Ecuador', ruc: '1798123456001' }
  ];
  
  isLoading = false;
  error: string | null = null;
  
  // Filtros
  statusFilter = 'all';
  searchTerm = '';
  
  // Modal
  showOrderModal = false;
  showOrderDetailModal = false;
  selectedOrder: Order | null = null;
  
  // Nuevo pedido
  newOrder = {
    customerId: 0,
    items: [] as OrderItem[],
    notes: ''
  };
  
  // Productos disponibles
  availableProducts = [
    { id: 1, name: 'Camarón 20/30', price: 17.33, stock: 1000 },
    { id: 2, name: 'Camarón 30/40', price: 15.00, stock: 800 },
    { id: 3, name: 'Camarón 40/50', price: 5.00, stock: 1200 }
  ];
  
  currentProduct = { productId: 0, quantity: 1 };

  // ========== FILTROS ==========
  applyFilters() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesStatus = this.statusFilter === 'all' || 
        order.status === this.statusFilter;
      
      const matchesSearch = !this.searchTerm || 
        order.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }

  // ========== ESTADÍSTICAS ==========
  getOrderStats() {
    const pending = this.orders.filter(o => o.status === 'pending').length;
    const delivered = this.orders.filter(o => o.status === 'delivered').length;
    const total = this.orders.reduce((sum, order) => sum + order.total, 0);
    
    return { pending, delivered, total };
  }

  loadData() {
    this.isLoading = true;
    setTimeout(() => {
      this.applyFilters();
      this.isLoading = false;
      this.error = null;
    }, 500);
  }

  // ========== GESTIÓN DE PEDIDOS ==========
  openNewOrderModal() {
    this.newOrder = {
      customerId: 0,
      items: [],
      notes: ''
    };
    this.showOrderModal = true;
  }

  addProductToOrder() {
    if (this.currentProduct.productId && this.currentProduct.quantity > 0) {
      const product = this.availableProducts.find(p => p.id === this.currentProduct.productId);
      if (product) {
        const newItem: OrderItem = {
          productId: product.id,
          productName: product.name,
          quantity: this.currentProduct.quantity,
          unitPrice: product.price,
          total: product.price * this.currentProduct.quantity
        };
        
        this.newOrder.items.push(newItem);
        this.currentProduct = { productId: 0, quantity: 1 };
      }
    }
  }

  removeItem(index: number) {
    this.newOrder.items.splice(index, 1);
  }

  calculateSubtotal(): number {
    return this.newOrder.items.reduce((sum, item) => sum + item.total, 0);
  }

  calculateTax(): number {
    return this.calculateSubtotal() * 0.12;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax();
  }

  createOrder() {
    if (this.newOrder.customerId === 0 || this.newOrder.items.length === 0) {
      this.error = 'Seleccione un cliente y agregue productos';
      return;
    }

    const customer = this.customers.find(c => c.id === this.newOrder.customerId);
    if (!customer) {
      this.error = 'Cliente no encontrado';
      return;
    }

    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax();
    const total = this.calculateTotal();

    const newOrder: Order = {
      id: `#${1000 + this.orders.length + 1}`,
      customerId: this.newOrder.customerId,
      customerName: customer.name,
      status: 'pending',
      orderDate: new Date(),
      deliveryDate: null,
      items: [...this.newOrder.items],
      subtotal,
      tax,
      total,
      invoiceNumber: null,
      notes: this.newOrder.notes,
      suggestion: 'Revisar disponibilidad de productos'
    };

    this.orders.push(newOrder);
    this.applyFilters();
    this.showOrderModal = false;
    this.error = null;
    
    alert(`Pedido ${newOrder.id} creado exitosamente`);
  }

  generateInvoice(order: Order) {
    if (order.status === 'pending') {
      order.status = 'delivered';
      order.invoiceNumber = `FAC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      order.deliveryDate = new Date();
      this.applyFilters();
      
      alert(`Factura ${order.invoiceNumber} generada exitosamente`);
    }
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
    this.showOrderDetailModal = true;
  }

  downloadInvoice(order: Order) {
    if (order.invoiceNumber) {
      const content = `Factura ${order.invoiceNumber}\nCliente: ${order.customerName}\nTotal: $${order.total}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${order.invoiceNumber}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      alert('Factura descargada');
    }
  }

  cancelOrder(order: Order) {
    if (confirm(`¿Cancelar el pedido ${order.id}?`)) {
      order.status = 'cancelled';
      this.applyFilters();
      alert('Pedido cancelado');
    }
  }

  // ========== HELPERS ==========
  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return '🔥';
      case 'processing': return '⏳';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getStatusText(status: string): string {
    const texts: Record<string, string> = {
      'pending': 'Pendiente',
      'processing': 'En Proceso',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return texts[status] || status;
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    if (diffHours > 0) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  }

  handleError(message: string, error: any) {
    this.error = message;
    this.isLoading = false;
    console.error(message, error);
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}