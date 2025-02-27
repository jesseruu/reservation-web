import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [MatListModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  needSignup = false;

  LoginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  SignupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  async ngOnInit() {
      const isUser = this.authService.isAuthenticated();
      if (isUser) {
        await this.router.navigate(['movies']);
      }
   }


  async login() {
    const body = {
      email: this.LoginForm.controls.email.value,
      password: this.LoginForm.controls.password.value
    }
    try {
      const userToken = await this.authService.signin(body);
      localStorage.setItem('token', userToken);
      this.openSnackBar('Inicio de sesion exito', 'Cerrar');
      await this.router.navigate(['..']);
    } catch (error) {
      this.openSnackBar('Correo electronico o contraseña no valida', 'Cerrar');
    }
  }

  async signup() {
    const body = {
      name: this.SignupForm.controls.name.value,
      email: this.SignupForm.controls.email.value,
      password: this.SignupForm.controls.password.value
    }
    try {
      await this.authService.signup(body);
      this.openSnackBar('Cuenta creada con exito', 'Cerrar');
      this.needSignup = false;
    } catch (error) {
      this.openSnackBar('Un error ocurrio creando cuenta, intente más tarde', 'Cerrar');
    }

  }

  enableSignup() {
    this.needSignup = true;
  }

  disableSignup() {
    this.needSignup = false;
  }

  async goBackToHome() {
    await this.router.navigate(['movies']);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
