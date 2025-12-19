import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  showPassword = false;
  isSubmitted = false;
  isLoading = false;

  errorMessage = '';

  credentials = {
    emailOrPhone: '',
    password: ''
  };

  constructor(private router: Router, private authService: AuthService) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // REAL LOGIN
  onSubmit(form: NgForm) {
    this.isSubmitted = true;

    if (!form.valid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(
      this.credentials.emailOrPhone,
      this.credentials.password
    ).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res?.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = res?.message || 'Login failed.';
        }
      },
      error: (err) => {
        this.isLoading = false;

        if (err.status === 401) {
          this.errorMessage = 'Invalid email/phone or password.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      }
    });
  }
}
