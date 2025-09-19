import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { RouterModule } from '@angular/router';
import { AppStore } from '../../Stores/app.store';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule,RouterModule],   
  templateUrl: './landing-page.component.html',
})

export class LandingPageComponent {
  appStore = inject(AppStore); // ✅ correct way
}
