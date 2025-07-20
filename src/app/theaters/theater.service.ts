import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Theater {
  theaterId?: number;
  name: string;
  location: string;
  capacity: number;
  currentMovieId?: number|null;
  movieName?: string;
  language?: string;
  genre?: string;
  description?: string;
  releaseDate?: string; // string format
  durationMinutes?: number;
}

@Injectable({ providedIn: 'root' })
export class TheaterService {
  private apiUrl = '/theater/api/theaters';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Theater[]> {
    return this.http.get<Theater[]>(this.apiUrl);
  }

  create(theater: Omit<Theater, 'theaterId'>): Observable<Theater> {
    return this.http.post<Theater>(this.apiUrl, theater);
  }

  update(theater: Theater): Observable<Theater> {
    return this.http.put<Theater>(`${this.apiUrl}/${theater.theaterId}`, theater);
  }

  delete(theaterId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${theaterId}`);
  }

  assignMovie(theaterId: number, movieId: number): Observable<Theater> {
    return this.http.post<Theater>(`${this.apiUrl}/${theaterId}/assign-movie/${movieId}`, {});
  }

  // You may also add methods for batch assignment, etc, if needed
}
