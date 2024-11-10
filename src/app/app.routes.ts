import { Routes } from '@angular/router';
import { MainComponent } from './components/pages/main/main.component';
import { adminRoutes } from './admin/admin.routes';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: MainComponent,
  },
  {
    path: 'admin',
    // component: AdminComponent,
    children: adminRoutes,

    
  },
];
