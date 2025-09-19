import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';   // 👈 added

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],   
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

  getStarted() {
    alert(`Welcome to ${this.appName}! 🚀`);
  }
}
