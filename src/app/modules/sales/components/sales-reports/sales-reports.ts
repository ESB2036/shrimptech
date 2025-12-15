import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces locales
interface MonthlySales {
  month: string;
  year: number;
  sales: number;
  growth: number;
}

interface TopClient {
  id: number;
  name: string;
  totalPurchases: number;
  percentage: number;
}

@Component({
  selector: 'app-sales-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-reports.html',
  styleUrl: './sales-reports.css'
})
export class SalesReports {
  // Datos
  monthlySales: MonthlySales[] = [
    { month: 'Ene', year: 2025, sales: 65000, growth: 5 },
    { month: 'Feb', year: 2025, sales: 75000, growth: 15 },
    { month: 'Mar', year: 2025, sales: 70000, growth: 8 },
    { month: 'Abr', year: 2025, sales: 82000, growth: 17 },
    { month: 'May', year: 2025, sales: 92000, growth: 25 },
    { month: 'Jun', year: 2025, sales: 100000, growth: 48 }
  ];
  
  topClients: TopClient[] = [
    { id: 1, name: 'Acuicola del Pacifico S.A.', totalPurchases: 68500, percentage: 32.5 },
    { id: 2, name: 'Mariscos del Litoral', totalPurchases: 42100, percentage: 20.0 },
    { id: 3, name: 'ExportCam Ecuador', totalPurchases: 35800, percentage: 17.0 },
    { id: 4, name: 'FreshSea Premium', totalPurchases: 28900, percentage: 13.7 },
    { id: 5, name: 'Camarones del Sur', totalPurchases: 18200, percentage: 8.6 }
  ];
  
  // Estadísticas
  totalSales = 0;
  growthPercentage = 0;
  topClientsPercentage = 92; 
  activeCustomers = 48;
  averageSale = 0;
  filterActive: 'all' | '6months' = 'all';
  
  // Gráfico
  maxBarHeight = 180;
  chartData: { month: string, sales: number, height: number, isHigh: boolean }[] = [];
  isLoading = false;

  ngOnInit() {
    this.prepareChartData();
    this.calculateStatistics();
  }

  prepareChartData() {
    const maxSales = Math.max(...this.monthlySales.map(m => m.sales));
    const highThreshold = maxSales * 0.8;
    
    this.chartData = this.monthlySales.map(month => ({
      month: month.month,
      sales: month.sales,
      height: (month.sales / maxSales) * this.maxBarHeight,
      isHigh: month.sales >= highThreshold
    }));
  }

  calculateStatistics() {
    if (this.monthlySales.length >= 2) {
      const currentMonth = this.monthlySales[this.monthlySales.length - 1];
      const previousMonth = this.monthlySales[this.monthlySales.length - 2];
      
      this.growthPercentage = currentMonth.growth;
      this.totalSales = this.monthlySales.reduce((sum, month) => sum + month.sales, 0);
      this.averageSale = this.totalSales / this.monthlySales.length;
    }
  }

  // ========== EXPORTACIÓN PDF ==========
  exportToPDF() {
    this.isLoading = true;
    
    setTimeout(() => {
      const pdfContent = this.generatePDFContent();
      
      const blob = new Blob([pdfContent], { 
        type: 'application/pdf' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte_Ventas_ShrimpTech_${new Date().toISOString().slice(0,10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      this.isLoading = false;
      this.showNotification('✅ Reporte PDF exportado exitosamente');
    }, 1500);
  }

  private generatePDFContent(): string {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    
    return `
      %PDF-1.4
      1 0 obj
      <<
      /Type /Catalog
      /Pages 2 0 R
      >>
      endobj
      2 0 obj
      <<
      /Type /Pages
      /Kids [3 0 R]
      /Count 1
      >>
      endobj
      3 0 obj
      <<
      /Type /Page
      /Parent 2 0 R
      /MediaBox [0 0 612 792]
      /Contents 4 0 R
      /Resources <<
        /Font <<
          /F1 5 0 R
        >>
      >>
      >>
      endobj
      4 0 obj
      <<
      /Length 2000
      >>
      stream
      BT
      /F1 24 Tf
      72 720 Td
      (REPORTE DE VENTAS - SHRIMPTECH) Tj
      ET
      BT
      /F1 12 Tf
      72 690 Td
      (Fecha: ${formattedDate}) Tj
      ET
      BT
      /F1 18 Tf
      72 650 Td
      (VENTAS MENSUALES 2025) Tj
      ET
      ${this.monthlySales.map((month, index) => `
      BT
      /F1 12 Tf
      ${72} ${620 - index * 30} Td
      (${month.month}: ${this.formatCurrency(month.sales)} (${month.growth}%)) Tj
      ET
      `).join('')}
      BT
      /F1 18 Tf
      72 400 Td
      (TOP 5 CLIENTES) Tj
      ET
      ${this.topClients.map((client, index) => `
      BT
      /F1 12 Tf
      ${72} ${370 - index * 30} Td
      (${index + 1}. ${client.name}: ${this.formatCurrency(client.totalPurchases)} (${client.percentage}%)) Tj
      ET
      `).join('')}
      BT
      /F1 14 Tf
      72 200 Td
      (RESUMEN GENERAL) Tj
      ET
      BT
      /F1 12 Tf
      72 170 Td
      (Total Ventas: ${this.formatCurrency(this.totalSales)}) Tj
      ET
      BT
      /F1 12 Tf
      72 140 Td
      (Crecimiento: ${this.formatPercentage(this.growthPercentage)}) Tj
      ET
      BT
      /F1 12 Tf
      72 110 Td
      (Clientes Activos: ${this.activeCustomers}) Tj
      ET
      BT
      /F1 12 Tf
      72 80 Td
      (Top 5 representa: ${this.topClientsPercentage}% del total) Tj
      ET
      endstream
      endobj
      5 0 obj
      <<
      /Type /Font
      /Subtype /Type1
      /BaseFont /Helvetica
      >>
      endobj
      xref
      0 6
      0000000000 65535 f
      0000000010 00000 n
      0000000079 00000 n
      0000000179 00000 n
      0000000300 00000 n
      0000002447 00000 n
      trailer
      <<
      /Size 6
      /Root 1 0 R
      >>
      startxref
      2586
      %%EOF
    `;
  }

  // ========== HELPERS ==========
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  getGrowthClass(growth: number): string {
    if (growth > 0) return 'growth-positive';
    if (growth < 0) return 'growth-negative';
    return 'growth-neutral';
  }

  getBarColor(isHigh: boolean, index: number): string {
    if (isHigh) return '#4caf50';
    return `hsl(${200 + index * 20}, 70%, 50%)`;
  }

  getBarTooltip(month: MonthlySales): string {
    return `$${month.sales.toLocaleString('en-US')} - ${month.month} ${month.year}
Crecimiento: ${month.growth}%`;
  }

  toggleChartType() {
    alert('Funcionalidad de cambio de gráfico - Para implementación futura');
  }

  showTooltip(event: MouseEvent, month: MonthlySales) {
    console.log('Mostrar tooltip para:', month);
  }

  hideTooltip() {
    console.log('Ocultar tooltip');
  }

  private showNotification(message: string) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4caf50;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  trackByMonth(index: number, month: MonthlySales): string {
    return `${month.year}-${month.month}`;
  }

  trackByClientId(index: number, client: TopClient): number {
    return client.id;
  }
}