import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Products } from './components/products/products';
import { Movements } from './components/movements/movements';
import { Alerts } from './components/alerts/alerts';
import { Reports } from './components/reports/reports';

const routes: Routes = [
  { path: 'products', component: Products },
  { path: 'movements', component: Movements },
  { path: 'alerts', component: Alerts },
  { path: 'reports', component: Reports },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
