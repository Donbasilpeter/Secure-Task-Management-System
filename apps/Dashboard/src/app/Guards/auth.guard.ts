import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStore } from '../Stores/auth.store'; // adjust path as needed

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authStore: AuthStore, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = !!this.authStore.user(); // check if user exists in store

    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
