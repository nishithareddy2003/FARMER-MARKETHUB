import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 2rem;
    }

    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h1 {
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      text-align: center;
    }

    .subtitle {
      color: #666;
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }

    input, select {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .error {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    button {
      width: 100%;
      padding: 1rem;
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover:not(:disabled) {
      background-color: #27ae60;
    }

    button:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }

    .role-selection {
      margin-bottom: 2rem;
    }

    .role-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .role-option {
      position: relative;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .role-option:hover {
      border-color: #2ecc71;
      transform: translateY(-2px);
    }

    .role-option.selected {
      border-color: #2ecc71;
      background-color: #f0fff4;
    }

    .role-option input[type="radio"] {
      position: absolute;
      opacity: 0;
    }

    .role-option label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      cursor: pointer;
    }

    .role-option .icon {
      width: 2rem;
      height: 2rem;
      fill: #2ecc71;
      margin-bottom: 0.5rem;
      transition: transform 0.2s ease;
    }

    .role-option:hover .icon {
      transform: scale(1.1);
    }

    .role-option h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.1rem;
    }

    .role-option p {
      margin: 0;
      font-size: 0.875rem;
      color: #64748b;
      text-align: center;
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      color: #666;
    }

    .auth-footer a {
      color: #2ecc71;
      text-decoration: none;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    .terms-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .terms-group input[type="checkbox"] {
      width: auto;
    }

    .terms-group label {
      margin: 0;
      font-size: 0.875rem;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
      confirmPassword: ['', Validators.required],
      role: ['customer', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    
    if (!password || !confirmPassword) return null;
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.isLoading = true;
    this.error = '';

    const userData = {
      firstName: this.registerForm.get('firstName')?.value.trim(),
      lastName: this.registerForm.get('lastName')?.value.trim(),
      email: this.registerForm.get('email')?.value.trim().toLowerCase(),
      password: this.registerForm.get('password')?.value,
      role: this.registerForm.get('role')?.value
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.error = '';
        alert('Registration successful! Please login with your credentials.');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration error:', error);
        
        if (error.status === 0) {
          this.error = 'Unable to connect to the server. Please make sure the backend server is running on port 5001.';
        } else if (error.status === 409) {
          this.error = 'This email is already registered';
        } else if (error.error && error.error.message) {
          this.error = error.error.message;
        } else {
          this.error = 'Registration failed. Please check your network connection and try again.';
        }
      }
    });
  }
}