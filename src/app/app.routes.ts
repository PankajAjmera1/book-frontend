import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Home route to show the "choose" page
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'movies',
    loadChildren: () => import('./movies/movies.routes').then(m => m.moviesRoutes)
  },
  {
    path: 'theaters',
    loadChildren: () => import('./theaters/theaters.routes').then(m => m.theatersRoutes)
  }
];
