import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [CommonModule],
  template: `
    <div class="dashboard admin">
      <h2>Welcome, Admin!</h2>
      <p>You are logged in as an ADMIN.</p>

      <button (click)="logout()">Logout</button>
    </div>
  `,
  styles: [`
    .dashboard.admin {
      max-width: 400px;
      margin: 60px auto;
      text-align: center;
      padding: 25px;
      border: 2px solid #4CAF50;
      border-radius: 10px;
      background-color: #f0fff3;
      font-family: Arial;
    }
    button {
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      margin-top: 20px;
      cursor: pointer;
    }
  `]
})
export class AdminComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('jwt');
    this.router.navigateByUrl('/');
  }
}
