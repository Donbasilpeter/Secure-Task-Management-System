import { Routes } from '@angular/router';
import { LandingPageComponent } from './Pages/landing-page/landing-page.component';
import { LoginPageComponent } from './Pages/login/login-page.component';
import { RegisterPageComponent } from './Pages/register/register-page.component';
import { DashboardPageComponent } from './Pages/dashboard/dashbaord.component';

export const appRoutes: Routes = [
  { path: '', component: LandingPageComponent },   // default landing page
  { path: 'landing', component: LandingPageComponent },
  {path: 'login',component:LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
    { path: 'dashboard', component: DashboardPageComponent},
];
