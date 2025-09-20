import { Routes } from '@angular/router';
import { LandingPageComponent } from './Pages/landing-page/landing-page.component';
import { LoginPageComponent } from './Pages/login/login-page.component';
import { RegisterPageComponent } from './Pages/register/register-page.component';
import { DashboardPageComponent } from './Pages/dashboard/dashbaord.component';
import { AuthGuard } from '../app/Guards/auth.guard'; 
import { GuestGuard } from '../app/Guards/guest.guard';
import { OrganisationPageComponent } from './Pages/organisations/organisaton.component';
import { DepartmentPageComponent } from './Pages/department/department-page.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },

  { path: 'landing', component: LandingPageComponent },

  { path: 'login', component: LoginPageComponent, canActivate: [GuestGuard] },
  { path: 'register', component: RegisterPageComponent, canActivate: [GuestGuard] },

  { path: 'dashboard', component: DashboardPageComponent, canActivate: [AuthGuard] }, 
  { path: 'organisations/:id', component: OrganisationPageComponent, canActivate: [AuthGuard] },
  { path: 'departments/:id', component: DepartmentPageComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'landing' }, // catch-all
];
