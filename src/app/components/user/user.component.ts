import { Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { jwtDecode } from "jwt-decode";
import { ReservationService } from '../../services/reservation/reservation.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MoviesService } from '../../services/movies/movies.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [MatExpansionModule, MatIconModule, MatButtonModule, MatListModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{
  user: any;
  reservations: any[] = [];
  private _snackBar = inject(MatSnackBar);

  MoviesForm =  new FormGroup({
    title: new FormControl('', [Validators.required]),
    releaseDate: new FormControl('', [Validators.required]),
    genres: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required]),
    imageUrl: new FormControl('', [Validators.required]),
    classification: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  constructor(private reservationService: ReservationService, private movieService: MoviesService, private router: Router) {

  }
  async ngOnInit() {
    this.user = this.getUserdata(localStorage.getItem('token') as string);
    if (this.user.name === 'admin') {
      await this.getAllReservations();
    } else {
      await this.getReservation();
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  getUserdata(token: string) {
      try {
        return jwtDecode(token);
      } catch (error) {
        return null;
      }
    }

    async getReservation() {
      this.reservations = await this.reservationService.getReservation(this.user.id);
    }

    async getAllReservations() {
      this.reservations = await this.reservationService.getAllReservation();
    }

    async createMovie() {
      const body = {
        title: this.MoviesForm.controls.title.value,
        releaseDate: this.MoviesForm.controls.releaseDate.value,
        genres: [this.MoviesForm.controls.genres.value],
        duration: this.MoviesForm.controls.duration.value,
        imageUrl: this.MoviesForm.controls.imageUrl.value,
        classification: this.MoviesForm.controls.classification.value,
        description: this.MoviesForm.controls.description.value
      } as any

      try {
        await this.movieService.createMovie(body);
        this.openSnackBar('Se creo la pelicula con exito', 'Cerrar');
        await this.router.navigate(['movies']);
      } catch (error) {
        this.openSnackBar('Hubo un error creando la pelicula', 'Cerrar');
      }
    }

    generateReport(data: any) {
      const replacer = (key: any, value: any) => (value === null ? '' : value);
      const header = Object.keys(data[0]);
      const csv = data.map((row:any) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(',')
      );
      csv.unshift(header.join(','));
      const csvArray = csv.join('\r\n');

      const a = document.createElement('a');
      const blob = new Blob([csvArray], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      a.href = url;
      a.download = 'myFile.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
}
