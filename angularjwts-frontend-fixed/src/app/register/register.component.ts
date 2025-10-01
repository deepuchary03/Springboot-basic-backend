import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-form">
      <h2>Register</h2>

      <form (ngSubmit)="register()" #regForm="ngForm">
        <label>Username:</label><br>
        <input type="text" [(ngModel)]="username" name="username" required><br>

        <label>Password:</label><br>
        <input type="password" [(ngModel)]="password" name="password" required><br>

        <label>Role (optional):</label><br>
        <input type="text" [(ngModel)]="role" name="role" placeholder="USER or ADMIN"><br><br>

        <button type="submit" [disabled]="!regForm.valid">Register</button>
      </form>

      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .register-form {
      max-width: 300px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 10px;
      font-family: Arial;
    }
    input {
      width: 100%;
      margin-bottom: 10px;
      padding: 8px;
    }
    button {
      width: 100%;
      padding: 10px;
    }
  `]
})
export class RegisterComponent {
  username = '';
  password = '';
  role = '';
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    const user = {
      username: this.username,
      password: this.password,
      role: this.role
    };

this.http.post('http://localhost:8080/api/register', user, { responseType: 'text' }).subscribe({
  next: () => {
    this.message = 'Registered successfully!';
    setTimeout(() => this.router.navigateByUrl('/login'), 1000);
  },
  error: (err) => {
    console.error(err);
    const msg = err.error?.message || err.error || err.statusText || 'Server not responding';
    this.message = 'Registration failed: ' + msg;
  }
});
  }
}
