import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  movieId?: number;
  movieName: string;
  description: string;
  genre: string;
  durationMinutes: number;
  releaseDate: string; // usually ISO string, e.g. '2024-07-18'
  language: string;
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiUrl = '/movie/api/movies';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  get(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/search?movie=${encodeURIComponent(query)}`);
  }

  create(movie: Omit<Movie, 'movieId'>): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie);
  }

  delete(movieId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${movieId}`);
  }

  update(movie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/${movie.movieId}`, movie);
  }
}
