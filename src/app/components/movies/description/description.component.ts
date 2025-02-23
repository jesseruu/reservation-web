import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../../../services/movies/movies.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { RoomsService } from '../../../services/rooms/rooms.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { jwtDecode } from "jwt-decode";
import { ReservationService } from '../../../services/reservation/reservation.service';

@Component({
  selector: 'app-description',
  imports: [MatChipsModule, MatExpansionModule, MatIconModule, MatButtonModule],
  templateUrl: './description.component.html',
  styleUrl: './description.component.scss'
})
export class DescriptionComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);

  movieId = 0;
  movieInfo: any;
  roomsInfo: any;
  date = '';
  days: string[] = [];
  seats: any[] = [];
  selectedSeats = new Map;
  selectedDate = new Map;
  constructor(private reservationService: ReservationService, private authService: AuthService, private route: ActivatedRoute, private movieService: MoviesService, private roomsService: RoomsService, private router: Router) {
  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.movieId = params['id'];
    });
    this.movieInfo = await this.movieService.getMovie(this.movieId);
    this.roomsInfo = await this.roomsService.getRooms();
    this.getDates();
    this.getSeats();
  }

  getSeats() {
    let seatsNumbers;
    for (const room of this.roomsInfo) {
      seatsNumbers = [];
      for (let i = 0; i < room.seatNumbers; i++) {
        seatsNumbers.push(`${i + 1}`);
      }
      this.seats.push(seatsNumbers);
    }
  }

  getDates() {
    const dates = [];
    const date = new Date();
    const currentHour = date.getHours();
    const maxTimes = Math.floor(Math.random() * 10) + 1

    for (let i = 0; i < maxTimes; i++) {
      const nextDate = new Date(date);
      let hours = Math.floor(Math.random() * (24 - currentHour)) + currentHour;
      let minutes = Math.random() < 0.5 ? 0 : 30;
      nextDate.setHours(hours);
      nextDate.setMinutes(minutes);
      nextDate.setSeconds(0);

      const formattedDate = `${nextDate.getFullYear()}/${(nextDate.getMonth() + 1).toString().padStart(2, '0')}/${nextDate.getDate().toString().padStart(2, '0')} ${nextDate.getHours().toString().padStart(2, '0')}:${nextDate.getMinutes().toString().padStart(2, '0')}:${nextDate.getSeconds().toString().padStart(2, '0')}`;
      dates.push(formattedDate);
    }

    dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    this.days = dates;
  }

  getDate(roomId: number, date: string){
    if (!this.selectedDate.has(roomId)) {
      this.selectedDate.clear();
      this.selectedDate.set(roomId, date);
    }
    this.selectedDate.set(roomId, date);
  }

  isValidReservation(roomId: number) {
      if (this.selectedDate.has(roomId) && this.selectedSeats.has(roomId)) {
        return true;
      }
      return false;
  }

  getSelectedSeat(roomId: number, seatId: string) {
     if (!this.selectedSeats.has(roomId)) {
      this.selectedSeats.clear();
      this.selectedSeats.set(roomId, [String(seatId)]);
      return;
     }
     const seats = this.selectedSeats.get(roomId);
     for (let seat of seats) {
      if(seat === String(seatId)) {
        return;
      }
     }
     seats.push(String(seatId));
     this.selectedSeats.set(roomId, seats);
  }

  async reserveMovie(roomId: number) {
    const isLogin = this.authService.isAuthenticated();
    if (!isLogin) {
      this.router.navigate(['auth']);
    }
    const user: any = this.getUserdata(localStorage.getItem('token') as string);

    const body = {
      movieId: String(this.movieId),
      startTime: this.selectedDate.get(roomId),
      roomId: String(roomId),
      seats: this.selectedSeats.get(roomId).map((seat :any) => {
        return {"seatCode": seat};
      })
    }

    try {
      await this.reservationService.createReservation(user.id, body);
      this.openSnackBar('Reserva con exito, una notificación llegara printo', 'Cerrar')
      await this.router.navigate(['movies']);
    } catch (error) {
      this.openSnackBar('Un error ocurrio haciando la reserva', 'Cerrar')
    }
  }

  getUserdata(token: string) {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
