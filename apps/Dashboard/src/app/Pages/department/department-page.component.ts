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

  deptId!: number;
  department: Department | undefined;

  // 🔹 Add user form
  addUserForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['viewer', Validators.required],
  });

  ngOnInit() {
    this.deptId = Number(this.route.snapshot.paramMap.get('id'));

    // Always fetch department on init
    this.fetchDepartment(this.deptId);
  }

  // 🔹 Fetch single department by ID
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

  // 🔹 Add user to department
  onAddUser() {
    if (!this.department || this.addUserForm.invalid) return;

    const token = this.authStore.token();
    if (!token) return;

    const payload = {
      email: this.addUserForm.value.email,
      role: this.addUserForm.value.role,
      departmentId: this.department.id,
    };

    this.http
      .post<any>(
        `${environment.apiUrl}/departments/${this.department.id}/users`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .subscribe({
        next: () => {
          alert('User added successfully');
          this.addUserForm.reset({ role: 'viewer' });
        },
        error: (err) => console.error('Failed to add user:', err),
      });
  }
}
