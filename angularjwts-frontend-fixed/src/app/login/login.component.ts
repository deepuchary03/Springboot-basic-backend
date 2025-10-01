import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-form">
      <h2>Login</h2>

      <form (ngSubmit)="login()" #loginForm="ngForm">
        <div>
          <label for="username">Username:</label><br>
          <input
            type="text"
            id="username"
            name="username"
            [(ngModel)]="username"
            required
          >
        </div>

        <div>
          <label for="password">Password:</label><br>
          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="password"
            required
          >
        </div>

        <button type="submit" [disabled]="!loginForm.form.valid">Login</button>
      </form>
    </div>
  `,
  styles: [`
    .login-form {
      max-width: 300px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 10px;
      font-family: Arial;
    }
    label {
      font-weight: bold;
    }
    input {
      width: 100%;
      margin-bottom: 15px;
      padding: 8px;
      box-sizing: border-box;
    }
    button {
      width: 100%;
      padding: 10px;
      background-color: #4CAF50;
      color: white;
      font-weight: bold;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #aaa;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}
login() {
  this.http.post<any>('http://localhost:8080/api/login', {
    username: this.username,
    password: this.password
  }).subscribe({
    next: res => {
      console.log('Login success response:', res);
      localStorage.setItem('jwt', res.token);

      // 🔑 Normalize role so "ROLE_ADMIN" -> "ADMIN"
      const rawRole = res.role || '';
      const role = rawRole.replace(/^ROLE_/, '').toUpperCase();

      if (role === 'ADMIN') {
        this.router.navigateByUrl('/admin');
      } else if (role === 'USER') {
        this.router.navigateByUrl('/user');
      } else {
        alert('Login successful, but role not recognized: ' + rawRole);
      }
    },
    error: err => {
      console.error('Login failed:', err);
      alert('Login failed. Please check your username and password.');
    }
  });
}
}
