import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService: AuthService, private router: Router) {

  }

  async canActivate() {
    if (!this.authService.isAuthenticated()) {
      await this.router.navigate(['auth']);
      return false;
    }
    return true;
  }
}
