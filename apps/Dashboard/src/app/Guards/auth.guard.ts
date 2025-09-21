import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../Stores/auth.store';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  canActivate(): boolean {
    if (!this.authStore.isAuthenticated()) {   
      this.router.navigate(['/landing']);
      return false;
    }
    return true;
  }
}
