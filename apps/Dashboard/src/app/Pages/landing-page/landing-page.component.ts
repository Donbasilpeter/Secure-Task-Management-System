import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule,RouterModule],   
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent {
  appName = 'Secure Task Manager';

  features = [
    {
      title: '✅ Task Management',
      description: 'Create, assign, and track tasks easily with role-based access.'
    },
    {
      title: '👥 Team Collaboration',
      description: 'Work seamlessly with Owners, Admins, and Viewers in departments.'
    },
    {
      title: '🔒 Secure Access',
      description: 'Fine-grained permissions ensure only the right people can edit.'
    }
  ];

}
