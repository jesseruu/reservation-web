import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { jwtDecode } from "jwt-decode";
import { ReservationService } from '../../services/reservation/reservation.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user',
  imports: [MatExpansionModule, MatIconModule, MatButtonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{
  user: any;
  reservations: any[] = [];
  constructor(private reservationService: ReservationService) {

  }
  async ngOnInit() {
    this.user = this.getUserdata(localStorage.getItem('token') as string);
    await this.getReservation();
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
