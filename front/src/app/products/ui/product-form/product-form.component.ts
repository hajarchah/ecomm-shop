import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
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
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    ButtonModule, 
    InputTextModule, 
    InputTextareaModule, 
    DropdownModule
  ],
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
          <label for="stock">Stock</label>
          <input id="stock" type="number" pInputText formControlName="stock" />
        </div>
        <div class="p-field">
          <label for="image">Image URL</label>
          <input id="image" type="text" pInputText formControlName="image" />
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
export class ProductFormComponent implements OnInit {
  @Input() product!: Product;
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
      image: ['']
    });
  }

  ngOnInit() {
    if (this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        category: this.product.category,
        stock: this.product.quantity,
        image: this.product.image
      });
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      this.save.emit({
        ...this.product,
        ...formValue,
        quantity: formValue.stock
      });
    }
  }
}
