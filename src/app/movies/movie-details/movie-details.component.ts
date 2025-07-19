import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService, Movie } from '../movie.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent {
  movie = signal<Movie | null>(null);
  loading = signal(true);
  error = signal('');

  constructor(private route: ActivatedRoute, private movieService: MovieService) {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.movieService.get(id).subscribe({
        next: m => { this.movie.set(m); this.loading.set(false); },
        error: _ => { this.error.set('Movie not found.'); this.loading.set(false); }
      });
    } else {
      this.error.set('Invalid movie ID.');
      this.loading.set(false);
    }
  }
}
