import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../Stores/auth.store';
import { environment } from '../../../environments/environment.'


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent implements OnInit {
  appName = 'Secure Task Management';
  errorMessage: string | null = null;
  isLoading = false;

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authStore: AuthStore // 👈 inject store
  ) {}

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

  this.http.post(`${environment.apiUrl}/users/login`, this.loginForm.value).subscribe({
    next: (res: any) => {
      this.isLoading = false;

      if (res?.access_token && res?.user) {
        this.authStore.login(res.access_token, res.user);
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Invalid response from server';
      }
    },
    error: (err) => {
      console.error('Login failed:', err);
      this.errorMessage = err.error?.message || 'Invalid email or password';
      this.isLoading = false;
    },
  });
  }
}
