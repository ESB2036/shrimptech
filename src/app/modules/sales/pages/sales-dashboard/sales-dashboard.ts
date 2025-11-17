import { Component } from '@angular/core';
import { CustomersPanel } from '../../components/customers-panel/customers-panel';
import { OrdersPanel } from '../../components/orders-panel/orders-panel';
import { SalesReports } from '../../components/sales-reports/sales-reports';

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [CustomersPanel, OrdersPanel, SalesReports],
  templateUrl: './sales-dashboard.html',
  styleUrl: './sales-dashboard.css',
})
export class SalesDashboard {}