import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CustomersPanel } from '../../components/customers-panel/customers-panel';
import { OrdersPanel } from '../../components/orders-panel/orders-panel';
import { SalesReports } from '../../components/sales-reports/sales-reports';

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [CommonModule, CustomersPanel, OrdersPanel, SalesReports], 
  templateUrl: './sales-dashboard.html',
  styleUrl: './sales-dashboard.css',
})
export class SalesDashboard {
  // Estadísticas en tiempo real
  activeCustomers = 48;
  monthlySales = 42850;
  pendingOrders = 1;
  
  // Tendencia
  salesTrend = 'up';
  customersTrend = 'up';
  ordersTrend = 'stable';
  
  // Notificaciones
  recentActivities = [
    { type: 'new-order', message: 'Nuevo pedido #1003', time: 'Hace 5 min' },
    { type: 'invoice-generated', message: 'Factura generada FAC-2025-0892', time: 'Hace 30 min' },
    { type: 'customer-added', message: 'Cliente nuevo registrado', time: 'Hace 2 horas' }
  ];
  
  isLoading = false;

  refreshDashboard() {
    this.isLoading = true;
    setTimeout(() => {
      this.pendingOrders = Math.max(0, this.pendingOrders + (Math.random() > 0.5 ? 1 : -1));
      this.monthlySales = Math.max(0, this.monthlySales + (Math.random() > 0.5 ? 500 : -500));
      this.calculateTrends();
      this.isLoading = false;
      alert('Dashboard actualizado');
    }, 1000);
  }

  calculateTrends() {
    this.salesTrend = this.monthlySales > 40000 ? 'up' : 'down';
    this.customersTrend = this.activeCustomers > 40 ? 'up' : 'stable';
    this.ordersTrend = this.pendingOrders > 10 ? 'up' : 'down';
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  }

  getTrendClass(trend: string): string {
    switch (trend) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      case 'stable': return 'trend-stable';
      default: return '';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}