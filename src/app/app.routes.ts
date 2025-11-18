import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Login } from './pages/login/login';
import { PrincipalDashboard } from './pages/principal-dashboard/principal-dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'login', component: Login },
  {
    path: 'principal-dashboard',
    component: PrincipalDashboard,
    canActivate: [authGuard],
  },
  {
    path: 'monitoring',
    loadChildren: () =>
      import('./modules/monitoring/monitoring-module').then((m) => m.MonitoringModule),
    canActivate: [authGuard],
  },
  {
    path: 'sales',
    loadChildren: () => import('./modules/sales/sales-module').then((m) => m.SalesModule),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./modules/inventory/inventory-module').then((m) => m.InventoryModule),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
