import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category, ProductFormData } from '../../models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  @Input() productData: ProductFormData = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId: '',
    isActive: true
  };
  @Output() close = new EventEmitter<void>();
  @Output() productSaved = new EventEmitter<void>();
  
  productForm: FormGroup;
  categories: Category[] = [];
  
  // Rename to match template
  imagePreviewUrls: string[] = [];
  selectedFiles: File[] = [];
  
  // Rename to match template
  submitting = false;
  errorMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {
    this.productForm = this.createForm();
  }
  
  ngOnInit(): void {
    this.loadCategories();
    this.initForm();
  }
  
  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      categoryId: ['', Validators.required],
      isActive: [true]
    });
  }
  
  private initForm(): void {
    if (this.productData) {
      this.productForm.patchValue({
        name: this.productData.name,
        description: this.productData.description,
        price: this.productData.price,
        quantity: this.productData.quantity,
        categoryId: this.productData.categoryId,
        isActive: this.productData.isActive !== undefined ? this.productData.isActive : true
      });
    }
  }
  
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.filter(c => c.isActive);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Failed to load categories';
      }
    });
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      this.imagePreviewUrls = []; // Updated to match template
      
      this.selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            this.imagePreviewUrls.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }
  
  // Rename to match template
  removeFile(index: number): void {
    this.imagePreviewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }
  
  // Rename to match template
  saveProduct(): void {
    if (this.productForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    // Check if we have enough images
    if (this.selectedFiles.length < 3) {
      this.errorMessage = 'Please upload at least 3 images for the product.';
      return;
    }
    
    // Check if we have too many images
    if (this.selectedFiles.length > 8) {
      this.errorMessage = 'Maximum 8 images are allowed.';
      return;
    }
    
    this.submitting = true;
    this.errorMessage = '';
    
    const productData: ProductFormData = this.productForm.value;
    
    this.productService.createProduct(productData, this.selectedFiles).subscribe({
      next: () => {
        this.submitting = false;
        this.productSaved.emit();
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.errorMessage = typeof error === 'string' ? error : error.message || 'Failed to create product';
        this.submitting = false;
      }
    });
  }
  
  closeModal(): void {
    this.close.emit();
  }
}
