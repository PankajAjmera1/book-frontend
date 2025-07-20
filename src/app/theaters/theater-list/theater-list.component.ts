import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TheaterService, Theater } from '../theater.service';

@Component({
  selector: 'app-theater-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theater-list.component.html',
  styleUrls: ['./theater-list.component.css']
})
export class TheaterListComponent {
  theaters = signal<Theater[]>([]);
  searchQuery = signal('');
  loading = signal(false);
  error = signal('');

  newTheater = signal<Omit<Theater, 'theaterId'>>({ name: '', location: '', capacity: 1 });
  addError = signal('');
  addSuccess = signal('');

  editTheater = signal<Theater|undefined>(undefined);
  editError = signal('');
  showEditDialog = signal(false);

  deleteTheaterId = signal<number|null>(null);
  showDeleteDialog = signal(false);

  assignMovieId = signal<number|null>(null);
  assignTheaterId = signal<number|null>(null);
  assignError = signal('');

  constructor(private theaterService: TheaterService) { this.fetchTheaters(); }

  fetchTheaters() {
    this.loading.set(true);
    this.theaterService.getAll().subscribe({
      next: t => { this.theaters.set(t ?? []); this.loading.set(false); },
      error: _ => { this.error.set('Cannot load theaters.'); this.loading.set(false); }
    });
  }
  onFieldChange(field: keyof Omit<Theater, 'theaterId'>, event: Event) {
    let value:any = (event.target as HTMLInputElement).value;
    if (field === 'capacity') value = Number(value);
    this.newTheater.update(t => ({ ...t, [field]: value }));
  }
  onAddTheater() {
    this.addError.set('');
    this.addSuccess.set('');
    const t = this.newTheater();
    if (!t.name.trim() || !t.location.trim() || !t.capacity || t.capacity < 1) {
      this.addError.set('All fields are required.');
      return;
    }
    this.theaterService.create(t).subscribe({
      next: created => {
        this.theaters.update(list => [created, ...list]);
        this.newTheater.set({ name: '', location: '', capacity: 1 });
        this.addSuccess.set('Theater added!');
      },
      error: _ => { this.addError.set('Could not add theater.'); }
    });
  }

  // ----------- EDIT -----------
  openEditDialog(theater: Theater) {
    this.editTheater.set({ ...theater });
    this.editError.set('');
    this.showEditDialog.set(true);
  }
  closeEditDialog() { this.showEditDialog.set(false); }
  onEditFieldChange(field: keyof Theater, event: Event) {
    let value:any = (event.target as HTMLInputElement).value;
    if (field === 'capacity') value = Number(value);
    this.editTheater.update(t => ({ ...t!, [field]: value }));
  }
  saveEditTheater() {
    const t = this.editTheater();
    if (!t?.name?.trim() || !t?.location?.trim() || !t?.capacity || t?.capacity < 1) {
      this.editError.set('All fields required.');
      return;
    }
    this.theaterService.update(t as Theater).subscribe({
      next: updated => {
        this.theaters.update(list => list.map(th => (th.theaterId === updated.theaterId ? updated : th)));
        this.closeEditDialog();
      },
      error: _ => { this.editError.set('Failed to update theater.'); }
    });
  }

  // ----------- DELETE -----------
  openDeleteDialog(id: number) { this.deleteTheaterId.set(id); this.showDeleteDialog.set(true); }
  closeDeleteDialog() { this.showDeleteDialog.set(false); }
  confirmDeleteTheater() {
    const id = this.deleteTheaterId();
    if (!id) return this.closeDeleteDialog();
    this.theaterService.delete(id).subscribe({
      next: _ => {
        this.theaters.update(list => list.filter(th => th.theaterId !== id));
        this.closeDeleteDialog();
      }
    });
  }

  // ----------- ASSIGN MOVIE -----------
  onAssignInput(event: Event, theaterId: number) {
    const val = Number((event.target as HTMLInputElement).value);
    this.assignMovieId.set(val);
    this.assignTheaterId.set(theaterId);
  }
  assignMovie(theaterId: number) {
    if (!this.assignMovieId()) return this.assignError.set('Movie ID required!');
    this.theaterService.assignMovie(theaterId, this.assignMovieId()!).subscribe({
      next: updated => {
        this.theaters.update(list => list.map(th => (th.theaterId === updated.theaterId ? updated : th)));
        this.assignMovieId.set(null);
        this.assignTheaterId.set(null);
        this.assignError.set('');
      },
      error: _ => this.assignError.set('Failed to assign movie.')
    });
  }
}
