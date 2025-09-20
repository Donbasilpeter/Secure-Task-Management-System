import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DepartmentStore, Department } from '../../Stores/department.store';
import { AuthStore } from '../../Stores/auth.store';
import { environment } from '../../../environments/environment.';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-department-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './department-page.component.html',
})
export class DepartmentPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  departmentStore = inject(DepartmentStore);
  authStore = inject(AuthStore);

  showUserModal = false;
  showTaskModal = false;

  deptId!: number;
  department: Department | undefined;
  tasks: any[] = [];

  // Add user form
  addUserForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['viewer', Validators.required],
  });

  // Create task form
  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    assignedToId: [this.authStore.user()?.id || null, Validators.required], // default self
  });

  ngOnInit() {
    this.deptId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchDepartment(this.deptId);
    this.fetchTasks(this.deptId);
    this.fetchUsers(this.deptId); // 🔹 fetch department users
  }

  // Fetch single department
  fetchDepartment(id: number) {
    const token = this.authStore.token();
    if (!token) return;

    this.http
      .get<Department>(`${environment.apiUrl}/departments/${id}/dpt`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (dept) => {
          this.department = dept;
          this.departmentStore.setCurrentDepartment(dept);
        },
        error: (err) => {
          console.error('Failed to fetch department:', err);
          this.department = undefined;
        },
      });
  }

  // Fetch tasks for department
  fetchTasks(id: number) {
    const token = this.authStore.token();
    if (!token) return;

    this.http
      .get<any[]>(`${environment.apiUrl}/tasks/department/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res) => (this.tasks = res),
        error: (err) => console.error('Failed to fetch tasks:', err),
      });
  }

  // 🔹 Fetch users
  fetchUsers(id: number) {
    const token = this.authStore.token();
    if (!token) return;

    this.http
      .get<any[]>(`${environment.apiUrl}/departments/${id}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res) => this.departmentStore.setUsers(res),
        error: (err) => console.error('Failed to fetch users:', err),
      });
  }

  // Add user
  onAddUser() {
    if (!this.department || this.addUserForm.invalid) return;

    const token = this.authStore.token();
    if (!token) return;

    const payload = {
      email: this.addUserForm.value.email,
      role: this.addUserForm.value.role,
    };

    this.http
      .post<any>(
        `${environment.apiUrl}/departments/${this.department.id}/users`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .subscribe({
        next: (user) => {
          alert('User added successfully');
          this.departmentStore.addUser(user); // update store
          this.addUserForm.reset({ role: 'viewer' });
        },
        error: (err) => console.error('Failed to add user:', err),
      });
  }

  // Create task
  onCreateTask() {
    if (!this.department || this.taskForm.invalid) return;

    const token = this.authStore.token();
    if (!token) return;

    const payload = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      departmentId: this.department.id,
      assignedToId: this.taskForm.value.assignedToId, // 🔹 new field
    };

    this.http
      .post<any>(`${environment.apiUrl}/tasks`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (task) => {
          this.tasks.unshift(task);
          this.taskForm.reset({
            assignedToId: this.authStore.user()?.id, // reset to self
          });
        },
        error: (err) => console.error('Failed to create task:', err),
      });
  }
}
