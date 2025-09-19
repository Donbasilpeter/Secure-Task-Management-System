import { Injectable, signal } from '@angular/core';
import {UserDTO} from "@secure-task-management-system/data"

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private _token = signal<string | null>(null);
  private _user = signal<UserDTO | null>(null);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = signal(false);

  constructor() {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (savedToken) this._token.set(savedToken);
    if (savedUser) this._user.set(JSON.parse(savedUser));
    if (savedToken) this.isAuthenticated.set(true);
  }

  login(token: string, user: UserDTO) {
    this._token.set(token);
    this._user.set(user);
    this.isAuthenticated.set(true);

    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  logout() {
    this._token.set(null);
    this._user.set(null);
    this.isAuthenticated.set(false);

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}
