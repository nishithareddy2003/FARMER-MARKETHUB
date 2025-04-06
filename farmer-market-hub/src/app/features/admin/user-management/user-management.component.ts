import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styles: [`
    .user-management-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      color: #2c3e50;
      margin: 0;
    }

    .search-box {
      flex: 1;
      max-width: 300px;
    }

    .search-input {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .users-table {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background-color: #f8f9fa;
      color: #2c3e50;
      font-weight: 600;
    }

    tr:hover {
      background-color: #f8f9fa;
    }

    .role-badge, .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .role-badge.admin {
      background-color: #e74c3c;
      color: white;
    }

    .role-badge.farmer {
      background-color: #2ecc71;
      color: white;
    }

    .role-badge.user {
      background-color: #3498db;
      color: white;
    }

    .status-badge.active {
      background-color: #2ecc71;
      color: white;
    }

    .status-badge.inactive {
      background-color: #95a5a6;
      color: white;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .action-buttons button {
      padding: 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .edit-button {
      background-color: #3498db;
      color: white;
    }

    .edit-button:hover {
      background-color: #2980b9;
    }

    .toggle-button {
      background-color: #f1c40f;
      color: white;
    }

    .toggle-button:hover {
      background-color: #f39c12;
    }

    .delete-button {
      background-color: #e74c3c;
      color: white;
    }

    .delete-button:hover {
      background-color: #c0392b;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-size: 1.1rem;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-content h2 {
      margin: 0 0 1.5rem 0;
      color: #2c3e50;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .cancel-button,
    .save-button {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s;
    }

    .cancel-button {
      background-color: #95a5a6;
      color: white;
    }

    .cancel-button:hover {
      background-color: #7f8c8d;
    }

    .save-button {
      background-color: #2ecc71;
      color: white;
    }

    .save-button:hover {
      background-color: #27ae60;
    }
  `]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';
  showEditModal: boolean = false;
  editingUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.authService.getUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
    });
  }

  filterUsers(): void {
    if (!this.searchQuery.trim()) {
      this.filteredUsers = this.users;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }

  editUser(user: User): void {
    this.editingUser = { ...user };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingUser = null;
  }

  saveUserChanges(): void {
    if (!this.editingUser) return;

    this.authService.updateUser(this.editingUser.id, this.editingUser).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
          this.filterUsers();
        }
        this.closeEditModal();
      },
      error: (error) => {
        console.error('Error updating user:', error);
        // Handle error (show notification, etc.)
      }
    });
  }

  toggleUserRole(user: User) {
    user.role = user.role === 'admin' ? 'customer' : 'admin';
    this.authService.updateUser(user.id, user).subscribe();
  }

  deleteUser(user: User): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.filterUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          // Handle error (show notification, etc.)
        }
      });
    }
  }
} 