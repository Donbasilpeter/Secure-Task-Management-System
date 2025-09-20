import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../Stores/auth.store';
import { OrganisationStore } from '../../Stores/organisation.store';
import { AppStore } from '../../Stores/app.store';
import { environment } from '../../../environments/environment.';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    HeaderComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardPageComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  authStore = inject(AuthStore);
  organisationStore = inject(OrganisationStore);
  appStore = inject(AppStore);

  showCreateForm = false;

  orgForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit() {
    this.loadOrganisations();
    this.loadStats();
  }

  loadOrganisations() {
    const token = this.authStore.token();
    if (!token) return;

    this.http
      .get<any[]>(`${environment.apiUrl}/organisations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (data) => this.organisationStore.setOrganisations(data),
        error: (err) => console.error('Failed to load organisations:', err),
      });
  }

  loadStats() {
    const token = this.authStore.token();
    if (!token) return;

    this.http
      .get<any>(`${environment.apiUrl}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (stats) => this.appStore.setStats(stats),
        error: (err) => console.error('Failed to load stats:', err),
      });
  }

  onCreateOrganisation() {
    if (this.orgForm.invalid) return;

    const token = this.authStore.token();
    if (!token) return;

    this.http
      .post<any>(
        `${environment.apiUrl}/organisations`,
        { name: this.orgForm.value.name },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .subscribe({
        next: (org) => {
          this.organisationStore.addOrganisation(org);
          this.orgForm.reset();
          this.showCreateForm = false;
        },
        error: (err) => console.error('Failed to create organisation:', err),
      });
  }

  cancelCreateOrganisation() {
    this.orgForm.reset();
    this.showCreateForm = false;
  }
  deleteOrganisation(id: number) {
  const confirmed = window.confirm('Are you sure you want to delete this organisation? This will remove all departments, users, and tasks under it.');
  if (!confirmed) return;

  const token = this.authStore.token();
  if (!token) return;

  this.http
    .delete(`${environment.apiUrl}/organisations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .subscribe({
      next: () => {
        // remove from store
        this.organisationStore.removeOrganisation(id);
      },
      error: (err) => console.error('Failed to delete organisation:', err),
    });
}


  goToOrg(id: number) {
    this.router.navigate(['/organisations', id]);
  }
}
