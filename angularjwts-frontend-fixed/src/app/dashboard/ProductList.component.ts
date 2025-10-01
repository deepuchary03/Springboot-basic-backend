// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/ProductService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [],
  template: `
    <div *ngIf="products.length > 0; else noData">
      <h3>Product List</h3>
      <ul>
        <li *ngFor="let product of products">
          {{ product.name }} - {{ product.price }}
        </li>
      </ul>
    </div>

    <ng-template #noData>
      <p>No products available or failed to fetch.</p>
    </ng-template>
  `
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: () => alert('Failed to fetch products. Make sure you are logged in.')
    });
  }
}
