import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { UsersDetailsComponent } from './users/users-details/users-details.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [

      {
        path: 'users',
        component: UsersComponent
      },
      { path: 'users/:id', component: UsersDetailsComponent }, 

     
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      }
    ]
  }
];
