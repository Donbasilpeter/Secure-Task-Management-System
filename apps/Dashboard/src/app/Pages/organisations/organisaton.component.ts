import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OrganisationStore } from '../../Stores/organisation.store';
import { AuthStore } from '../../Stores/auth.store';
import { DepartmentStore,Department } from '../../Stores/department.store';
import { environment } from '../../../environments/environment.';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router'; 


@Component({
  selector: 'app-organisation',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule,HeaderComponent,RouterModule],
  templateUrl: './organisation.component.html',
})
export class OrganisationPageComponent implements OnInit {
  private router = inject(Router);      
  private route = inject(ActivatedRoute);  
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  organisationStore = inject(OrganisationStore);
  departmentStore = inject(DepartmentStore);
  authStore = inject(AuthStore);

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
      this.fetchOrganisation(id);
      this.loadDepartments(id);
    }
  }
  // organisation.component.ts
openDepartment(dept: Department) {
  this.departmentStore.setCurrentDepartment(dept);
  this.router.navigate(['/departments', dept.id]);
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
        next: (data) => this.departmentStore.setDepartments(data),
        error: (err) => console.error('Failed to load departments:', err),
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
          this.departmentStore.addDepartment(dept);
          this.deptForm.reset();
          this.showCreateDeptForm = false;
        },
        error: (err) => console.error('Failed to create department:', err),
      });
  }

  cancelCreateDepartment() {
    this.deptForm.reset();
    this.showCreateDeptForm = false;
  }
}
