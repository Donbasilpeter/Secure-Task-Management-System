import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DepartmentStore, Department } from '../../Stores/department.store';
import { AuthStore } from '../../Stores/auth.store';
import { TaskStore } from '../../Stores/task.store';
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
  taskStore = inject(TaskStore);

  showUserModal = false;
  showTaskModal = false;
  showCommentsModal = false;

  deptId!: number;
  department: Department | undefined;

  selectedTask: any | null = null;
  comments: any[] = [];

  // Add user form
  addUserForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['viewer', Validators.required],
  });

  // Create task form
  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    assignedToId: [this.authStore.user()?.id || null, Validators.required],
  });

  // Add comment form
  commentForm = this.fb.group({
    comment: ['', Validators.required],
  });

  ngOnInit() {
    this.deptId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchDepartment(this.deptId);
    this.fetchTasks(this.deptId);
    this.fetchUsers(this.deptId);
  }

  // Fetch department
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

  // Fetch tasks
  fetchTasks(id: number) {
    const token = this.authStore.token();
    if (!token) return;

    this.http
      .get<any[]>(`${environment.apiUrl}/tasks/department/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res) => this.taskStore.setTasks(res),
        error: (err) => console.error('Failed to fetch tasks:', err),
      });
  }

  // Fetch users
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
          this.departmentStore.addUser(user);
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
      assignedToId: this.taskForm.value.assignedToId,
    };

    this.http
      .post<any>(`${environment.apiUrl}/tasks`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (task) => {
          this.taskStore.addTask(task);
          this.taskForm.reset({
            assignedToId: this.authStore.user()?.id,
          });
        },
        error: (err) => console.error('Failed to create task:', err),
      });
  }

  // Open comments modal
  onOpenTask(task: any) {
    this.selectedTask = task;
    this.showCommentsModal = true;
    this.fetchComments(task.id);
  }

  // Fetch comments
  fetchComments(taskId: number) {
    const token = this.authStore.token();
    if (!token) return;

    this.http
      .get<any[]>(`${environment.apiUrl}/tasks/${taskId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res) => (this.comments = res),
        error: (err) => console.error('Failed to fetch comments:', err),
      });
  }

  // Add comment
  onAddComment() {
    if (!this.selectedTask || this.commentForm.invalid) return;

    const token = this.authStore.token();
    if (!token) return;

    const payload = { comment: this.commentForm.value.comment };

    this.http
      .post<any>(
        `${environment.apiUrl}/tasks/${this.selectedTask.id}/comments`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .subscribe({
        next: (newComment) => {
          this.comments.push(newComment);
          this.commentForm.reset();
        },
        error: (err) => console.error('Failed to add comment:', err),
      });
  }
}
