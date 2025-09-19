import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.'

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent implements OnInit {
  appName = 'Secure Task Management';
  errorMessage: string | null = null;
  isLoading = false;
  successMessage: string | null = null;

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formData = this.registerForm.value;

    this.http.post(`${environment.apiUrl}/users/register`, formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = 'Registered successfully!';
        // Optionally redirect to login after a delay
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err.error?.message)
        this.errorMessage = err.error?.statusCode =="409" ? err.error?.message : 'Registration failed. Please try again.';
      },
    });
  }
}
