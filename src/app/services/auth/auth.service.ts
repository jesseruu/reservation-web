import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isUserAuthenticated: boolean = false;
  authChange: Subject<boolean> = new Subject<boolean>();

  constructor(private router: Router) {
    this.authChange.subscribe((value) => {
      this.isUserAuthenticated = value;
    });
  }

  headers = {
    'X-RqUID': '837ad18b-81b6-4f0e-9c95-0af476b7c089',
    'Content-Type': 'application/json',
  }

  async signin(info: { email: string | null, password: string | null }) {
    const url = `${environment.url}/auth/signin`;
    try {
      const response = await fetch(url, { method: 'POST', headers: this.headers, body: JSON.stringify(info)});
      if(!response.ok) {
        throw new Error('Error on login');
      }
      this.authChange.next(true);
      return await response.text();
    } catch (error) {
      throw error;
    }
  }

  async signup(info: { name: string | null, email: string | null, password: string | null}) {
    const url = `${environment.url}/auth/signup`;
    try {
      const response = await fetch(url, { method: 'POST', headers: this.headers, body: JSON.stringify(info) });
      if (!response.ok) {
        throw new Error('Error on signup');
      }
      return 'Created'
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    localStorage.clear();
    this.authChange.next(false);
    await this.router.navigate(['movies']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      return true;
    }
    return false;
  }

}
