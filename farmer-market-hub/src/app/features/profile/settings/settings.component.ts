import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <h2>Profile Settings</h2>
      <form (ngSubmit)="saveSettings()">
        <div class="form-group">
          <label>First Name</label>
          <input type="text" [(ngModel)]="user.firstName" name="firstName">
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input type="text" [(ngModel)]="user.lastName" name="lastName">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="user.email" name="email">
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input type="tel" [(ngModel)]="user.phone" name="phone">
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      padding: 0.75rem 1.5rem;
      background: #2ecc71;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class SettingsComponent implements OnInit {
  user: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'customer',
    phone: '',
    address: '',
    avatarUrl: '',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = { ...user };
      }
    });
  }

  saveSettings(): void {
    this.authService.updateUser(this.user.id, this.user).subscribe();
  }
} 