import { Injectable, signal, computed } from '@angular/core';

export interface Organisation {
  id: number;
  name: string;
  createdAt?: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class OrganisationStore {
  // 🔹 State
  private _organisations = signal<Organisation[]>([]);

  // 🔹 Public readonly signals
  readonly organisations = this._organisations.asReadonly();
  readonly orgCount = computed(() => this._organisations().length);


  // 🔹 Mutators
  setOrganisations(orgs: Organisation[]) {
    this._organisations.set(orgs);
  }

  addOrganisation(org: Organisation) {
    this._organisations.update((current) => [...current, org]);
  }

  clear() {
    this._organisations.set([]);
  }
}
