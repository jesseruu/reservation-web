import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  headers = {
      'X-RqUID': '837ad18b-81b6-4f0e-9c95-0af476b7c089'
    }

    async getRooms() {
      const url = `${environment.url}/rooms`;
      const response = await fetch(url, { method: 'GET', headers: this.headers });
      if (!response.ok) {
        console.log('An error occurred')
      }
      const rooms = await response.json();
      return rooms;
    }

    async getRoom(name: string) {
      const url = `${environment.url}/rooms/${name}`;
      const response = await fetch(url, { method: 'GET', headers: this.headers });
      if (!response.ok) {
        console.log('An error occurred');
      }
      const room = await response.json();
      return room;
    }

}
