import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  headers = {
    'X-RqUID': '837ad18b-81b6-4f0e-9c95-0af476b7c089',
    'Content-Type': 'application/json',
  }

  constructor() { }

    async getReservation(userId: string) {
      const url = `${environment.url}/users/${userId}/reservations`;
      const response = await fetch(url, { method: 'GET', headers: this.headers });
      if (!response.ok) {
        console.log('An error occurred')
      }
      const reservation = await response.json();
      return reservation;
    }

    async getAllReservation() {
      const url = `${environment.url}/reservations`;
      const response = await fetch(url, { method: 'GET', headers: this.headers });
      if (!response.ok) {
        console.log('An error occurred')
      }
      const reservation = await response.json();
      return reservation;
    }

    async createReservation(userId: string, body: {
      movieId: string,
      roomId: string,
      startTime: string,
      seats: object[]
    }) {
      const url = `${environment.url}/users/${userId}/reservations`;
      const response = await fetch(url, { method: 'POST', headers: this.headers, body: JSON.stringify(body) });
      if (!response.ok) {
        console.log('An error occurred');
      }
      try {
        const reservationCreated = await response.json();
        return reservationCreated;
      } catch (error) {
        throw error;
      }

    }
}
