import { Injectable, signal, computed } from '@angular/core';

export interface Organisation {
  id: number;
  name: string;
  createdAt?: string;
  role?: string;
  departmentsCount?: number;
}

export interface OrganisationUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class OrganisationStore {
  //  State
  private _organisations = signal<Organisation[]>([]);
  private _currentOrg = signal<Organisation | null>(null);
  private _users = signal<OrganisationUser[]>([]); // NEW

  //  Public readonly signals
  readonly organisations = this._organisations.asReadonly();
  readonly orgCount = computed(() => this._organisations().length);
  readonly currentOrg = this._currentOrg.asReadonly();
  readonly users = this._users.asReadonly(); // NEW

  //  Mutators
  setOrganisations(orgs: Organisation[]) {
    this._organisations.set(orgs);
  }

  addOrganisation(org: Organisation) {
    this._organisations.update((current) => [...current, org]);
  }

  clear() {
    this._organisations.set([]);
    this._currentOrg.set(null);
    this._users.set([]); // clear users too
  }

  //  Current organisation
  setCurrentOrg(org: Organisation | null) {
    this._currentOrg.set(org);
  }

  //  Users
  setUsers(users: OrganisationUser[]) {
    this._users.set(users);
  }

  addUser(user: OrganisationUser) {
    this._users.update((current) => [...current, user]);
  }

  removeUser(userId: number) {
    this._users.update((current) => current.filter((u) => u.id !== userId));
  }
  removeOrganisation(id: number) {
  this._organisations.update((orgs) =>
    orgs.filter((org) => org.id !== id)
  );
}

}
