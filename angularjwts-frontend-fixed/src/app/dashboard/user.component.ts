import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-user',
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2>Welcome, User!</h2>
      <p>You are logged in as a USER.</p>

      <button (click)="logout()">Logout</button>

      <div class="products" *ngIf="products.length > 0">
        <h3>Available Products:</h3>
        <ul>
          <li *ngFor="let product of products">
            {{ product.name }} - ₹{{ product.price }}
          </li>
        </ul>
      </div>

      <div *ngIf="products.length === 0">
        <p>Loading products or none available...</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 400px;
      margin: 60px auto;
      text-align: center;
      padding: 25px;
      border: 2px solid #2196F3;
      border-radius: 10px;
      background-color: #f3faff;
      font-family: Arial;
    }
    button {
      padding: 10px 20px;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 5px;
      margin-top: 20px;
      cursor: pointer;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      text-align: left;
      margin: 5px 0;
    }
  `]
})
export class UserComponent implements OnInit {
  products: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    const token = localStorage.getItem('jwt');
    console.log('JWT token for products API:', token);

    if (!token) {
      alert('No token found. Please login again.');
      this.router.navigateByUrl('/');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
     console.log("In authorization header two things are set " , headers)
    this.http.get<any[]>('http://localhost:8080/api/products', { headers })
      .subscribe({
        next: data => {
          this.products = data;
        },
        error: err => {
          console.error('Product fetch failed:', err);
          if (err.status === 401) {
            alert('Session expired. Please login again.');
            this.router.navigateByUrl('/');
          } else {
            alert('Failed to load products. Please try again.');
          }
        }
      });
  }

  logout() {
    localStorage.removeItem('jwt');
    this.router.navigateByUrl('/');
  }
}

/*What the JwtFilter Actually Does:
Every time an HTTP request hits a secured endpoint (like /api/products), Spring Security triggers the JwtFilter before it allows the controller to process the request.

Here’s how it works in your filter:


Intercept the Request:

The filter listens for every incoming HTTP request (like GET /api/products).

Check the Authorization Header:

If the header starts with "Bearer ", it means the request might have a JWT token.


String authHeader = request.getHeader("Authorization");
Extract and Validate the Token:

The token is extracted using authHeader.substring(7).

You use jwtUtil.extractRole(token) to validate the token and extract the role (you could also extract the username or other claims).

Set Authentication in SecurityContext:

If the token is valid and no user is already authenticated for this request (SecurityContextHolder is empty), Spring sets up an authenticated context:


UsernamePasswordAuthenticationToken authToken = 
  new UsernamePasswordAuthenticationToken(role, null, Collections.singleton(() -> role));
This lets Spring know:  “This user is authenticated for this request!”

Continue with the Request:

Now that authentication is done, the request moves on to your controller (ProductController), and your backend returns the products.

 Why Is This Necessary?

Even though the user is "logged in" on the frontend:

JWT is stateless: The backend does not store any session. So every API call must re-validate the token.

Without JwtFilter, the backend would treat the user as unauthenticated, because Spring Security wouldn't know who's making the request.*/
