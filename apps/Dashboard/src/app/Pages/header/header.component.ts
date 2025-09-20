import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStore } from '../../Stores/auth.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  authStore = inject(AuthStore);
  private router = inject(Router);

  // 🔹 Dynamic title support
  @Input() title: string = 'Dashboard';

  logout() {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }
}
