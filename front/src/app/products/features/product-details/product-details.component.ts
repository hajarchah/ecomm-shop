import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, catchError, of } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputNumberModule
  ],
  providers: [MessageService],
  template: `
    <div class="product-details-container">
      <div *ngIf="product$ | async as product; else loading" class="product-details">
        <div class="product-image">
          <img [src]="product.image" [alt]="product.name">
        </div>
        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <p class="product-category">{{ product.category }}</p>
          <p class="product-price">{{ product.price | currency:'USD' }}</p>
          <div class="product-description">
            <h3>Description</h3>
            <p>{{ product.description }}</p>
          </div>
          
          <div class="product-actions">
            <p-inputNumber [(ngModel)]="quantity" [showButtons]="true" [min]="1" [max]="product.stock" buttonLayout="horizontal"></p-inputNumber>
            <button pButton label="Add to Cart" icon="pi pi-shopping-cart" class="p-button-success"></button>
            <button pButton icon="pi pi-heart" class="p-button-outlined p-button-rounded p-button-secondary"></button>
          </div>
        </div>
      </div>
      
      <ng-template #loading>
        <div class="loading">Loading product details...</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .product-details-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .product-details {
      display: flex;
      gap: 2rem;
    }
    
    .product-image {
      flex: 1;
    }
    
    .product-image img {
      width: 100%;
      max-height: 500px;
      object-fit: contain;
      border-radius: 8px;
    }
    
    .product-info {
      flex: 1;
    }
    
    .product-category {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    
    .product-price {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2196F3;
      margin-bottom: 1.5rem;
    }
    
    .product-description {
      margin-bottom: 2rem;
    }
    
    .product-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .loading {
      text-align: center;
      padding: 3rem;
      font-size: 1.2rem;
      color: #666;
    }
    
    @media (max-width: 768px) {
      .product-details {
        flex-direction: column;
      }
      
      .product-image {
        margin-bottom: 1.5rem;
      }
    }
  `]
})
export class ProductDetailsComponent implements OnInit {
  product$: Observable<Product | null> = of(null);
  productId: number = 0;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = +id;
        this.loadProductDetails();
      }
    });
  }

  private loadProductDetails(): void {
    this.product$ = this.http.get<Product>(`${environment.apiUrl}/products/${this.productId}`)
      .pipe(
        catchError(error => {
          console.error('Error loading product', error);
          return of(null);
        })
      );
  }
}