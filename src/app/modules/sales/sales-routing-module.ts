import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesDashboard } from './pages/sales-dashboard/sales-dashboard';

const routes: Routes = [{ path: '', component: SalesDashboard }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}