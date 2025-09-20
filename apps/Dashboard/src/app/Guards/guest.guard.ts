import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../Stores/auth.store';

@Injectable({ providedIn: 'root' })
export class GuestGuard {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.authStore.isAuthenticated()) {   // 👈 must call it!
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
