import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="manage-home">
      <h1>Admin Panel</h1>
      <div class="manage-links">
        <a routerLink="/movies" class="manage-link">🎬 Movie Manage</a>
        <a routerLink="/theaters" class="manage-link">🏛️ Theater Manage</a>
      </div>
    </div>
  `,
  styles: [`
    .manage-home {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      min-height: 60vh;
    }
    .manage-links {
      display: flex; gap: 2rem; margin-top: 2rem;
    }
    .manage-link {
      padding: 2rem 2.5rem; background: #f5f2fd; border-radius: 19px;
      color: #6c16a6;
      font-size: 1.5rem; font-weight: 700; text-decoration: none;
      box-shadow: 0 2px 12px #ccc8f9;
      transition: box-shadow 0.15s, transform 0.12s, background 0.1s;
    }
    .manage-link:hover {
      background: #d5bafc;
      transform: translateY(-4px) scale(1.04);
      color: #3d116a;
      box-shadow: 0 8px 24px #ccbbfd;
    }
  `]
})
export class HomeComponent {}
