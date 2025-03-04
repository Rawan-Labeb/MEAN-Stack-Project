import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category, Product, ProductFormData } from '../../models/product.model';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  @Input() product: Product | null = null;
  @Input() productData: ProductFormData = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId: '',
    isActive: true
  };
  @Output() close = new EventEmitter<void>();
  @Output() productUpdated = new EventEmitter<void>();
  
  productForm: FormGroup;
  categories: Category[] = [];
  imagePreviewUrls: string[] = []; // Changed to match add product
  existingImages: string[] = [];
  selectedFiles: File[] = [];
  submitting = false; // Changed to match add product
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
    if (this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        quantity: this.product.quantity,
        categoryId: typeof this.product.categoryId === 'string' 
          ? this.product.categoryId 
          : (this.product.categoryId as Category)._id,
        isActive: this.product.isActive
      });
      
      this.existingImages = [...(this.product.images || [])];
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
      this.imagePreviewUrls = []; // Changed to match add product
      
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
  
  // Changed to match add product
  removeFile(index: number): void {
    this.imagePreviewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }
  
  removeExistingImage(index: number): void {
    this.existingImages.splice(index, 1);
  }
  
  // Changed method name to match template
  updateProduct(): void {
    if (this.productForm.invalid || !this.product) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    // Check if we have enough images (existing + new)
    const totalImages = this.existingImages.length + this.selectedFiles.length;
    if (totalImages < 3) {
      this.errorMessage = 'Please maintain at least 3 images for the product.';
      return;
    }
    
    // Check if we have too many images
    if (totalImages > 8) {
      this.errorMessage = `Too many images selected. Maximum allowed is 8, you have ${totalImages}.`;
      return;
    }
    
    this.submitting = true;
    this.errorMessage = '';
    
    const productData: ProductFormData = {
      ...this.productForm.value,
      images: this.existingImages
    };
    
    this.productService.updateProduct(this.product._id, productData, this.selectedFiles).subscribe({
      next: () => {
        this.submitting = false;
        this.productUpdated.emit();
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.errorMessage = typeof error === 'string' ? error : error.message || 'Failed to update product';
        this.submitting = false;
      }
    });
  }
  
  closeModal(): void {
    this.close.emit();
  }
}
