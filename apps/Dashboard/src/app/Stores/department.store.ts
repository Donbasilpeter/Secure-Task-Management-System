import { Injectable, signal, computed } from '@angular/core';

export interface Department {
  id: number;
  name: string;
  organisationId: number;
  role?: string; // owner, admin, viewer
}

export interface DepartmentUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class DepartmentStore {
  private _departments = signal<Department[]>([]);
  private _currentDepartment = signal<Department | null>(null);

  // 🔹 NEW: users of the current department
  private _users = signal<DepartmentUser[]>([]);

  // 🔹 Public readonly signals
  readonly departments = this._departments.asReadonly();
  readonly count = computed(() => this._departments().length);
  readonly currentDepartment = this._currentDepartment.asReadonly();
  readonly users = this._users.asReadonly(); // NEW

  // 🔹 Mutators for departments
  setDepartments(depts: Department[]) {
    this._departments.set(depts);
  }

  addDepartment(dept: Department) {
    this._departments.update((current) => [...current, dept]);
  }

  clear() {
    this._departments.set([]);
    this._currentDepartment.set(null);
    this._users.set([]); // clear users too
  }

  setCurrentDepartment(dept: Department | null) {
    this._currentDepartment.set(dept);
  }

  // 🔹 NEW: Mutators for users
  setUsers(users: DepartmentUser[]) {
    this._users.set(users);
  }

  addUser(user: DepartmentUser) {
    this._users.update((current) => [...current, user]);
  }

  removeUser(userId: number) {
    this._users.update((current) => current.filter((u) => u.id !== userId));
  }
}
