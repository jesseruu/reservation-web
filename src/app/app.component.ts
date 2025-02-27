import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIconModule, MatButtonModule, MatToolbarModule, MatDividerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'reservation-web';
  isUserLogin = false;

  constructor(private router: Router, private authService: AuthService) {
  }

  async goToLogin() {
    await this.router.navigate(['auth']);
  }

  async logout() {
    await this.authService.logout();
    this.isUserLogin = this.authService.isAuthenticated();
  }

  async goToHome() {
    await this.router.navigate(['movies']);
  }

  async goToProfile() {
    await this.router.navigate(['profile']);
  }

  get isAuthenticated(): boolean {
    this.isUserLogin = this.authService.isUserAuthenticated;
    return this.isUserLogin;
  }

  ngOnInit(): void {
    this.isUserLogin = this.authService.isAuthenticated();
  }
}
