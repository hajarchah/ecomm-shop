import { Component, OnInit, inject } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Product } from "../../data-access/product.model";
import { ProductService } from "../../data-access/products.service";
import { CartService } from "../../../cart/data-access/cart.service";
import { MessageService, ConfirmationService } from "primeng/api";

// PrimeNG imports
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from "primeng/toolbar";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TableModule } from "primeng/table";
import { DialogModule } from 'primeng/dialog';
import { ProductFormComponent } from "../../ui/product-form/product-form.component";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule, 
    ButtonModule, 
    InputTextModule,
    DropdownModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    TableModule,
    DialogModule,
    ProductFormComponent
  ],
  providers: [CurrencyPipe, MessageService, ConfirmationService],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  
  public products: Product[] = [];
  public filteredProducts: Product[] = [];
  public searchQuery = '';
  public selectedCategory = '';
  public categories: { label: string; value: string }[] = [];
  public selectedProduct: Product | null = null;
  public productDialog = false;

  readonly emptyProduct: Product = {
    id: 0, // Add this line
    code: '',
    name: '',
    description: '',
    image: '',
    category: '',
    price: 0,
    inventoryStatus: 'INSTOCK',
    quantity: 0,
    rating: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    shellId: 0,
    internalReference: ''
  };
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.initializeFiltering();
        this.filterProducts();
      },
      error: (error) => {
        console.error('Failed to load products', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load products'
        });
      }
    });
  }

  private initializeFiltering(): void {
    const uniqueCategories = [...new Set(this.products
      .filter(product => product.category)
      .map(product => product.category))];
    
    this.categories = [
      { label: 'All Categories', value: '' },
      ...uniqueCategories.map(category => ({
        label: category,
        value: category
      }))
    ];
    
    this.filteredProducts = [...this.products];
  }
  
  public filterProducts(): void {
    if (!this.searchQuery && !this.selectedCategory) {
      this.filteredProducts = [...this.products];
      return;
    }
    
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchQuery || 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase());
        
      const matchesCategory = !this.selectedCategory || 
        product.category === this.selectedCategory;
        
      return matchesSearch && matchesCategory;
    });
  }

  public addToCart(product: Product): void {
    this.cartService.addToCart(product, 1).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product added to cart'
        });
      },
      error: (error) => {
        console.error('Failed to add to cart', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add product to cart'
        });
      }
    });
  }

  public onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://via.placeholder.com/300x150?text=No+Image';
  }

  public openNew(): void {
    this.selectedProduct = null;
    this.productDialog = true;
  }

  public editProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.productDialog = true;
  }

  public deleteProduct(product: Product): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${product.name}?`,
      accept: () => {
        this.productsService.deleteProduct(product.id).subscribe({
          next: () => {
            this.loadProducts();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Product deleted'
            });
          },
          error: (error) => {
            console.error('Failed to delete product', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete product'
            });
          }
        });
      }
    });
  }

  public saveProduct(product: Partial<Product>): void {
    if (this.selectedProduct?.id) {
      this.productsService.updateProduct(this.selectedProduct.id, product).subscribe({
        next: () => {
          this.loadProducts();
          this.productDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product updated'
          });
        },
        error: (error) => {
          console.error('Failed to update product', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update product'
          });
        }
      });
    } else {
      this.productsService.createProduct(product).subscribe({
        next: () => {
          this.loadProducts();
          this.productDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product created'
          });
        },
        error: (error) => {
          console.error('Failed to create product', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create product'
          });
        }
      });
    }
  }
}
