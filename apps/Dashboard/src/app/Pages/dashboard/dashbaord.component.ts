import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthStore } from '../../Stores/auth.store';
import { OrganisationStore } from '../../Stores/organisation.store';
import { environment } from '../../../environments/environment.'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardPageComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  authStore = inject(AuthStore);
  organisationStore = inject(OrganisationStore);

  ngOnInit() {
    this.loadOrganisations();
  }
  
  // API call → update store
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

  // API call → update store
  createOrganisation() {
    const name = prompt('Enter organisation name:');
    if (!name) return;

    const token = this.authStore.token();
    if (!token) return;

    this.http
      .post<any>(
        `${environment.apiUrl}/organisations`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .subscribe({
        next: (org) => this.organisationStore.addOrganisation(org),
        error: (err) =>
          console.error('Failed to create organisation:', err),
      });
  }

  goToOrg(id: number) {
    this.router.navigate(['/organisations', id]);
  }

  logout() {
    this.authStore.logout();
    this.organisationStore.clear();
    this.router.navigate(['/login']);
  }
}
