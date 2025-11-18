import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRoutingModule } from './inventory-routing-module';
import { Products } from './components/products/products';
import { Movements } from './components/movements/movements';
import { Alerts } from './components/alerts/alerts';
import { Reports } from './components/reports/reports';

@NgModule({
  imports: [
    CommonModule,
    InventoryRoutingModule,
    Products,  
    Movements,
    Alerts,
    Reports
  ]
})
export class InventoryModule { }
