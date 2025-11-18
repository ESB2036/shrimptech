import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../models/IUser';

@Injectable({
  providedIn: 'root',
})
export class Authorization {
  private readonly users: IUser[] = [
    { username: 'johan', password: '1234', name: 'Johan Tigrero', role: 'Administrador' },
    { username: 'heidy', password: '1234', name: 'Heidy Mendoza', role: 'Operario de Producción' },
    { username: 'edu', password: '1234', name: 'Edú Sabando', role: 'Técnico de Monitoreo' },
    { username: 'miguel', password: '1234', name: 'Miguel Salazar', role: 'Vendedor' },
    { username: 'emely', password: '1234', name: 'Emely Obando', role: 'Bodeguero' },
  ];

  readonly loggedIn$ = new BehaviorSubject<boolean>(false);
  readonly currentUser$ = new BehaviorSubject<string | null>(null);
  readonly currentUserRole$ = new BehaviorSubject<string | null>(null);

  login(user: string, pass: string): boolean {
    const userFound = this.users.find((u) => u.username === user && u.password === pass);

    if (userFound) {
      this.loggedIn$.next(true);
      this.currentUser$.next(userFound.name);
      this.currentUserRole$.next(userFound.role);
      return true;
    } else {
      this.loggedIn$.next(false);
      this.currentUser$.next(null);
      this.currentUserRole$.next(null);
      return false;
    }
  }

  logout(): void {
    this.loggedIn$.next(false);
    this.currentUser$.next(null);
    this.currentUserRole$.next(null);
  }
}
