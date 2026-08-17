import { Routes } from '@angular/router';
import { RoleSelectionComponent } from './modules/auth/role-selection/role-selection';

export const routes: Routes = [

  {
    path: '',
    component: RoleSelectionComponent,
  },

  // ==================== PATIENT ====================

  {
    path: 'auth/patient/login',
    loadComponent: () =>
      import('./modules/auth/patient/login/login')
        .then((module) => module.Login),
  },

  {
    path: 'auth/patient/register',
    loadComponent: () =>
      import('./modules/auth/patient/register/register')
        .then((module) => module.Register),
  },

  {
    path: 'auth/patient/otp',
    loadComponent: () =>
      import('./modules/auth/patient/otp/otp')
        .then((module) => module.Otp),
  },

  // ==================== DOCTOR ====================

  {
    path: 'auth/doctor/login',
    loadComponent: () =>
      import('./modules/auth/doctor/login/login')
        .then((module) => module.Login),
  },

  {
    path: 'auth/doctor/register',
    loadComponent: () =>
      import('./modules/auth/doctor/register/register')
        .then((module) => module.DoctorRegisterComponent),
  },

  // ==================== HOSPITAL ====================

  {
    path: 'auth/hospital/login',
    loadComponent: () =>
      import('./modules/auth/hospital/login/login')
        .then((module) => module.Login),
  },
{
    path: 'auth/hospital/register',
    loadComponent: () => import('./modules/auth/hospital/register/register').then((module) => module.Register),
  },
  
  // ==================== PHARMACIST ====================

  {
    path: 'auth/pharmacist/login',
    loadComponent: () =>
      import('./modules/auth/pharmacist/login/login')
        .then((module) => module.Login),
  },

  {
    path: 'auth/pharmacist/register',
    loadComponent: () =>
      import('./modules/auth/pharmacist/register/register')
        .then((module) => module.Register),
  },

  // ==================== LABORATORY ====================

  {
    path: 'auth/laboratory/login',
    loadComponent: () =>
      import('./modules/auth/laboratory/login/login')
        .then((module) => module.LoginComponent),
  },

  {
    path: 'auth/laboratory/register',
    loadComponent: () =>
      import('./modules/auth/laboratory/register/register')
        .then((module) => module.RegisterComponent),
  },

  // ==================== AMBULANCE ====================

  {
    path: 'auth/ambulance/login',
    loadComponent: () =>
      import('./modules/auth/ambulance/login/login')
        .then((module) => module.Login),
  },

  {
    path: 'auth/ambulance/register',
    loadComponent: () =>
      import('./modules/auth/ambulance/register/register')
        .then((module) => module.Register),
  },

  // ==================== ADMIN ====================

  {
    path: 'auth/admin/login',
    loadComponent: () =>
      import('./modules/auth/admin/login/login')
        .then((module) => module.Login),
  },

  // ==================== INVALID ROUTE ====================

  {
    path: '**',
    redirectTo: '',
  },
];