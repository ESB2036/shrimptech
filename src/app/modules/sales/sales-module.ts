import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesRoutingModule } from './sales-routing-module';
import { SalesDashboard } from './pages/sales-dashboard/sales-dashboard';
import { CustomersPanel } from './components/customers-panel/customers-panel';
import { OrdersPanel } from './components/orders-panel/orders-panel';
import { SalesReports } from './components/sales-reports/sales-reports';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SalesRoutingModule,
    RouterModule,
    FormsModule,
    SalesDashboard,
    CustomersPanel,
    OrdersPanel,
    SalesReports,
  ],
})
export class SalesModule {}