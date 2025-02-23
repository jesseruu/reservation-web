import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies/movies.service';
import { environment } from '../../../environments/environment';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movies',
  imports: [MatPaginatorModule, MatCardModule, MatButtonModule, MatChipsModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit {

  movies?: any[];
  currentPage = 1;
  totalPages = 0;
  count?: number;


  constructor(private movieService: MoviesService, private router: Router) {}

  async ngOnInit() {
    await this.loadMovies();
  }

  async handlePageEvent(event: any) {
    this.currentPage = (event.pageIndex + 1);
    await this.loadMovies();
  }

  async loadMovies() {
    const response = await this.movieService.getMovies(this.currentPage, environment.limit);
    this.count = response.count;
    this.totalPages = response.totalPages;
    this.movies = response.movies;
  }

  async goToMovie(movieId: number){
    await this.router.navigate(['movies', String(movieId)]);
  }
}
