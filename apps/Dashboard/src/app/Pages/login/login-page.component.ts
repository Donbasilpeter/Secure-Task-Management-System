import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule,RouterModule], // 👈 standalone imports
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent implements OnInit {
  appName = 'Secure Task Management';
  errorMessage: string | null = null;
  isLoading = false;

  loginForm!: FormGroup; // declare here, initialize later

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.http.post('/api/users/login', this.loginForm.value).subscribe({
      next: (res: any) => {
        if (res?.token) {
          localStorage.setItem('auth_token', res.token);
        }
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = err.error?.message || 'Invalid email or password';
        this.isLoading = false;
      },
    });
  }
}
