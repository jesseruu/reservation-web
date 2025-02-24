import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  headers = {
    'X-RqUID': '837ad18b-81b6-4f0e-9c95-0af476b7c089',
    'Content-Type': 'application/json',
  }

  async getMovies(page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const url = `${environment.url}/movies?limit=${String(pageSize)}&offset=${String(offset)}`;
    const response = await fetch(url, { method: 'GET', headers: this.headers });
    if (!response.ok) {
      console.log('An error occurred')
    }
    const { count, movies } = await response.json();
    const totalPages = Math.ceil(count / pageSize);
    return { movies, totalPages, count };
  }

  async createMovie(body: {
    title: string,
    releaseDate: number,
    genres: string[],
    duration: number,
    imageUrl: string,
    classification: string,
    description: string
  }) {
    const url = `${environment.url}/movies`;

    try {
      const response = await fetch(url, { method: 'POST', headers: this.headers, body: JSON.stringify(body) });
      if (!response.ok) {
        throw new Error('Error creating movie');
      }
      const movie = await response.json();
      return movie;
    } catch (error) {
      throw error;
    }
  }

  async getMovie(id: number) {
    const url = `${environment.url}/movies/${id}`;
    const response = await fetch(url, { method: 'GET', headers: this.headers });
    if (!response.ok) {
      console.log('An error occurred');
    }
    const movie = await response.json();
    return movie;
  }
}
