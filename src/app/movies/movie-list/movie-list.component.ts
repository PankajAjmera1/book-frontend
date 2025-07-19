import { Component, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService, Movie } from '../movie.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements AfterViewInit {
  movies = signal<Movie[]>([]);
  loading = signal(false);
  error = signal('');
  searchQuery = signal('');

  // For add movie form
  newMovie = signal<Omit<Movie, 'movieId'>>({
    movieName: '',
    description: '',
    genre: '',
    durationMinutes: 120,
    releaseDate: '',
    language: ''
  });
  addError = signal('');
  addSuccess = signal('');

  // EDIT/DELETE dialog logic
  editMovie = signal<Partial<Movie>>({});
  editError = signal('');
  showEditDialog = signal(false);

  pendingDeleteMovieId = signal<number | null>(null);
  showDeleteDialog = signal(false);

  constructor(private movieService: MovieService) {
    this.fetchMovies();
  }

  ngAfterViewInit() {
    // nothing needed here for signals/dialog
  }

  // =================== ADD/SEARCH FUNCTIONS ===================

  onInput(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  fetchMovies() {
    this.loading.set(true);
    this.error.set('');
    this.movieService.getAll().subscribe({
      next: movies => { this.movies.set(movies ?? []); this.loading.set(false); },
      error: _ => { this.error.set('Cannot load movies.'); this.loading.set(false); }
    });
  }

  onSearch() {
    const q = this.searchQuery().trim();
    if (!q) {
      this.fetchMovies();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.movieService.search(q).subscribe({
      next: movies => { this.movies.set(movies ?? []); this.loading.set(false); },
      error: _ => { this.error.set('Search failed.'); this.loading.set(false); }
    });
  }

  onFieldChange(field: keyof Omit<Movie, 'movieId'>, event: Event) {
    let value: any = (event.target as HTMLInputElement).value;
    if (field === 'durationMinutes') value = Number(value);
    this.newMovie.update(v => ({ ...v, [field]: value }));
  }
  onAddMovie() {
    const movie = this.newMovie();
    this.addError.set('');
    this.addSuccess.set('');
    if (
      !movie.movieName.trim() || !movie.genre.trim() || !movie.description.trim() ||
      !movie.durationMinutes || !movie.releaseDate || !movie.language.trim()
    ) {
      this.addError.set('Please fill all details');
      return;
    }
    this.movieService.create(movie).subscribe({
      next: created => {
        this.movies.update(lst => [created, ...lst]);
        this.addSuccess.set('Movie added!');
        this.newMovie.set({
          movieName: '',
          description: '',
          genre: '',
          durationMinutes: 120,
          releaseDate: '',
          language: ''
        });
      },
      error: err => {
        const msg = err.error && typeof err.error === 'object'
          ? Object.values(err.error).join(', ')
          : 'Error adding movie.';
        this.addError.set(msg);
      }
    });
  }

  // =================== EDIT DIALOG FUNCTIONS ===================

  openEditDialog(movie: Movie) {
    this.editMovie.set({ ...movie });
    this.editError.set('');
    this.showEditDialog.set(true);
  }
  closeEditDialog() {
    this.showEditDialog.set(false);
    this.editError.set('');
  }
  onEditFieldChange(field: keyof Movie, event: Event) {
    let value: any = (event.target as HTMLInputElement).value;
    if (field === 'durationMinutes') value = Number(value);
    this.editMovie.update(v => ({ ...v, [field]: value }));
  }
  saveEditMovie() {
    const updated = this.editMovie();
    if (
      !updated.movieName?.trim() ||
      !updated.genre?.trim() ||
      !updated.description?.trim() ||
      !updated.durationMinutes ||
      !updated.releaseDate ||
      !updated.language?.trim()
    ) {
      this.editError.set('Please fill all details');
      return;
    }
    this.movieService
      .update(updated as Movie).subscribe({
        next: response => {
          this.movies.update(list =>
            list.map(mv => (mv.movieId === response.movieId ? response : mv))
          );
          this.closeEditDialog();
        },
        error: err => {
          this.editError.set('Failed to update movie.');
        }
      });
  }

  // =================== DELETE DIALOG FUNCTIONS ===================

  openDeleteDialog(movie: Movie) {
    this.pendingDeleteMovieId.set(movie.movieId ?? null);
    this.showDeleteDialog.set(true);
  }
  closeDeleteDialog() {
    this.pendingDeleteMovieId.set(null);
    this.showDeleteDialog.set(false);
  }
  confirmDeleteMovie() {
    const id = this.pendingDeleteMovieId();
    if (!id) return this.closeDeleteDialog();
    this.movieService.delete(id).subscribe({
      next: () => {
        this.movies.update(lst => lst.filter(mv => mv.movieId !== id));
        this.closeDeleteDialog();
      },
      error: err => {
        this.error.set('Failed to delete movie.');
        this.closeDeleteDialog();
      }
    });
  }
}
