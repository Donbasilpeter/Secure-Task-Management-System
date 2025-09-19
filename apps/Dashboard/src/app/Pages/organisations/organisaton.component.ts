import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OrganisationStore } from '../../Stores/organisation.store';
import { AuthStore } from '../../Stores/auth.store';
import { environment } from '../../../environments/environment.';

@Component({
  selector: 'app-organisation',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './organisation.component.html',
})
export class OrganisationPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  organisationStore = inject(OrganisationStore);
  authStore = inject(AuthStore);

  departments = signal<any[]>([]);
  showCreateDeptForm = false;

  deptForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

ngOnInit() {
  const id = Number(this.route.snapshot.paramMap.get('id'));

  // Try from store first
  const org = this.organisationStore.organisations().find((o) => o.id === id);
  if (org) {
    this.organisationStore.setCurrentOrg(org);
    this.loadDepartments(org.id);
  } else {
    // 🔹 Store is empty after refresh → fetch org from API
    this.fetchOrganisation(id);
    this.loadDepartments(id);
  }
}
  fetchOrganisation(id: number) {
  const token = this.authStore.token();
  if (!token) return;

  this.http
    .get<any>(`${environment.apiUrl}/organisations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .subscribe({
      next: (org) => this.organisationStore.setCurrentOrg(org),
      error: (err) => console.error('Failed to fetch organisation:', err),
    });
}


  // 🔹 Load all departments
  loadDepartments(orgId: number) {
    const token = this.authStore.token();
    if (!token) return;

    this.http
      .get<any[]>(`${environment.apiUrl}/departments/${orgId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (data) => this.departments.set(data),
        error: (err) =>
          console.error('Failed to load departments:', err),
      });
  }

  // 🔹 Create department
  onCreateDepartment() {
    if (this.deptForm.invalid) return;

    const token = this.authStore.token();
    if (!token) return;

    const orgId = this.organisationStore.currentOrg()?.id;
    if (!orgId) return;

    this.http
      .post<any>(
        `${environment.apiUrl}/departments`,
        { name: this.deptForm.value.name, organisationId: orgId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .subscribe({
        next: (dept) => {
          this.departments.update((current) => [...current, dept]);
          this.deptForm.reset();
          this.showCreateDeptForm = false;
        },
        error: (err) =>
          console.error('Failed to create department:', err),
      });
  }

  cancelCreateDepartment() {
    this.deptForm.reset();
    this.showCreateDeptForm = false;
  }
}
