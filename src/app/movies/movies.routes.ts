import { Routes } from '@angular/router';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';

export const moviesRoutes: Routes = [
  { path: '', component: MovieListComponent },
  { path: ':id', component: MovieDetailsComponent }
];
