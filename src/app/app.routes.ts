import { Routes } from '@angular/router';
import { RoleSelection } from './modules/auth/role-selection/role-selection';

export const routes: Routes = [
  {
    path: '',
    component: RoleSelection
  },
  {
    path: '**',
    redirectTo: ''
  }
];