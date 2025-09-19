import { Injectable, signal, computed } from '@angular/core';

export interface Organisation {
  id: number;
  name: string;
  createdAt?: string;
  role?: string;
  departmentsCount?: number;
}

@Injectable({ providedIn: 'root' })
export class OrganisationStore {
  // 🔹 State
  private _organisations = signal<Organisation[]>([]);
  private _currentOrg = signal<Organisation | null>(null);

  // 🔹 Public readonly signals
  readonly organisations = this._organisations.asReadonly();
  readonly orgCount = computed(() => this._organisations().length);
  readonly currentOrg = this._currentOrg.asReadonly();

  // 🔹 Mutators
  setOrganisations(orgs: Organisation[]) {
    this._organisations.set(orgs);
  }

  addOrganisation(org: Organisation) {
    this._organisations.update((current) => [...current, org]);
  }

  clear() {
    this._organisations.set([]);
    this._currentOrg.set(null);
  }

  // 🔹 Current organisation
  setCurrentOrg(org: Organisation | null) {
    this._currentOrg.set(org);
  }
}
