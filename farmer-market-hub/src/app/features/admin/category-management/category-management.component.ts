import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="category-management">
      <h1>Category Management</h1>
      <p>Category management functionality coming soon...</p>
    </div>
  `,
  styles: [`
    .category-management {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
  `]
})
export class CategoryManagementComponent {} 