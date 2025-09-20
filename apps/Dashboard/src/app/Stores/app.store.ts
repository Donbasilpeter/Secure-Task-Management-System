import { Injectable, signal, computed } from '@angular/core';

export interface AppStats {
  organisations: number;
  departments: number;
  assignedTasks: number;
}

@Injectable({ providedIn: 'root' })
export class AppStore {
  // 🔹 Constants (don’t change at runtime)
  readonly appName = 'Secure Task Manager';
  readonly features = [
    {
      title: '✅ Task Management',
      description: 'Create, assign, and track tasks easily with role-based access.',
    },
    {
      title: '👥 Team Collaboration',
      description: 'Work seamlessly with Owners, Admins, and Viewers in departments.',
    },
    {
      title: '🔒 Secure Access',
      description: 'Fine-grained permissions ensure only the right people can edit.',
    },
  ];

  // 🔹 Reactive state
  private _stats = signal<AppStats>({
    organisations: 0,
    departments: 0,
    assignedTasks: 0,
  });

  // 🔹 Public readonly signals
  readonly stats = this._stats.asReadonly();

  // 🔹 Derived computed values
  readonly totalStats = computed(
    () =>
      this._stats().organisations +
      this._stats().departments +
      this._stats().assignedTasks,
  );

  // 🔹 Mutators
  setStats(stats: AppStats) {
    this._stats.set(stats);
  }

  updateStats(partial: Partial<AppStats>) {
    this._stats.update((current) => ({ ...current, ...partial }));
  }

  clearStats() {
    this._stats.set({
      organisations: 0,
      departments: 0,
      assignedTasks: 0,
    });
  }
}
