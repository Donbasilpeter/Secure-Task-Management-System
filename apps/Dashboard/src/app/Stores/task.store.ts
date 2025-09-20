import { Injectable, signal, computed } from '@angular/core';

export interface Task {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  createdBy?: any;
  assignedTo?: any;
  departmentId: number;
}

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private _tasks = signal<Task[]>([]);
  private _currentTask = signal<Task | null>(null);

  // 🔹 Public signals
  readonly tasks = this._tasks.asReadonly();
  readonly count = computed(() => this._tasks().length);
  readonly currentTask = this._currentTask.asReadonly();

  // 🔹 Mutators
  setTasks(tasks: Task[]) {
    this._tasks.set(tasks);
  }

  addTask(task: Task) {
    this._tasks.update((current) => [task, ...current]);
  }

  setCurrentTask(task: Task | null) {
    this._currentTask.set(task);
  }

  clear() {
    this._tasks.set([]);
    this._currentTask.set(null);
  }
}
