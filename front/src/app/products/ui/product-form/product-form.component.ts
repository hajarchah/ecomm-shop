import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../data-access/product.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputTextareaModule, DropdownModule],
  template: `
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
      <div class="p-fluid">
        <div class="p-field">
          <label for="name">Name</label>
          <input id="name" type="text" pInputText formControlName="name" required />
        </div>
        <div class="p-field">
          <label for="description">Description</label>
          <textarea id="description" pInputTextarea formControlName="description" required></textarea>
        </div>
        <div class="p-field">
          <label for="price">Price</label>
          <input id="price" type="number" pInputText formControlName="price" required />
        </div>
        <div class="p-field">
          <label for="category">Category</label>
          <input id="category" type="text" pInputText formControlName="category" />
        </div>
        <div class="p-field">
          <label for="quantity">Quantity</label>
          <input id="quantity" type="number" pInputText formControlName="stock" />
        </div>
        <div class="p-field">
          <label for="inventoryStatus">Inventory Status</label>
          <input id="inventoryStatus" type="text" pInputText [(ngModel)]="product.inventoryStatus" name="inventoryStatus" required />
        </div>
        <div class="p-field">
          <label for="image">Image URL</label>
          <input id="image" type="text" pInputText formControlName="imageUrl" />
        </div>
      </div>
      <div class="p-d-flex p-jc-between">
        <button pButton type="button" label="Cancel" class="p-button-secondary" (click)="cancel.emit()"></button>
        <button pButton type="submit" label="Save" class="p-button-primary"></button>
      </div>
    </form>
  `,
  styles: [`
    .p-field {
      margin-bottom: 1rem;
    }
  `]
})
export class ProductFormComponent {
  @Input() product: Product = {
    id: 0,
    code: '',
    name: '',
    description: '',
    image: '',
    category: '',
    price: 0,
    quantity: 0,
    inventoryStatus: 'INSTOCK',
    rating: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    internalReference: '',
    shellId: 0
  };
  @Output() save = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();

  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      category: [''],
      stock: [0, [Validators.min(0)]],
      imageUrl: [''] // Optional
    });
  }

  onSubmit() {
    this.save.emit(this.productForm.value);
  }
}
