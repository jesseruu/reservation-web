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
  isAdmin = false;

  constructor(private router: Router, private authService: AuthService) {}

  async goToLogin() {
    await this.router.navigate(['auth']);
  }

  async logout() {
    await this.authService.logout();
    this.checkUser();
  }

  async goToHome() {
    await this.router.navigate(['movies']);
  }

  checkUser() {
    this.isUserLogin = this.authService.isAuthenticated();
  }

  async goToProfile() {
    await this.router.navigate(['profile']);
  }

  ngOnInit(): void {
    this.checkUser();
  }
}
