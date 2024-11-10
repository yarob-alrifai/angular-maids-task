import { Routes } from '@angular/router';
import { MainComponent } from './components/pages/main/main.component';
import { adminRoutes } from './admin/admin.routes';
import { SsComponent } from './ss/ss.component';
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
    // component: SsComponent,
    children: adminRoutes,

    
  },
];
