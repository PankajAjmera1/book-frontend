import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  {
    path: 'movies',
    loadChildren: () => import('./movies/movies.routes').then(m => m.moviesRoutes)
  }
  // Add more routes here if you add more features later
];
