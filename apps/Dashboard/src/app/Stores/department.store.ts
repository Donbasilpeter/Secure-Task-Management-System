import { Injectable, signal, computed } from '@angular/core';

export interface Department {
  id: number;
  name: string;
  organisationId: number;
  role?: string; // owner, admin, viewer
}

@Injectable({ providedIn: 'root' })
export class DepartmentStore {
  private _departments = signal<Department[]>([]);
  private _currentDepartment = signal<Department | null>(null); 

  // 🔹 Public readonly signals
  readonly departments = this._departments.asReadonly();
  readonly count = computed(() => this._departments().length);
  readonly currentDepartment = this._currentDepartment.asReadonly(); // expose current dept

  // 🔹 Mutators
  setDepartments(depts: Department[]) {
    this._departments.set(depts);
  }

  addDepartment(dept: Department) {
    this._departments.update((current) => [...current, dept]);
  }

  clear() {
    this._departments.set([]);
    this._currentDepartment.set(null);
  }

  // 🔹 Set / clear current department
  setCurrentDepartment(dept: Department | null) {
    this._currentDepartment.set(dept);
  }
}
