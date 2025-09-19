import { Routes } from '@angular/router';
import { LandingPageComponent } from './Pages/landing-page/landing-page.component';

export const appRoutes: Routes = [
  { path: '', component: LandingPageComponent },   // default landing page
  { path: 'landing', component: LandingPageComponent }
];
