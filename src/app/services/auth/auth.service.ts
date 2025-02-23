import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {

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
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    localStorage.clear();
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
