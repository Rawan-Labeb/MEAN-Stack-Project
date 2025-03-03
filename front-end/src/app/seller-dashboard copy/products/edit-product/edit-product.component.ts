import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category, Product, ProductFormData } from '../../models/product.model';
import { SellerUploadComponent } from '../../components/seller-upload/seller-upload.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SellerUploadComponent]
})
export class EditProductComponent implements OnInit {
  @Input() product!: Product;
  @Input() productData!: ProductFormData;
  @Output() close = new EventEmitter<void>();
  @Output() productUpdated = new EventEmitter<void>();

  productForm!: FormGroup;
  categories: Category[] = [];
  loading = false;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  existingImages: string[] = [];
  errorMessage: string | null = null;
  isSubmitting = false;
  show = true;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    
    if (this.product && this.product.images) {
      this.existingImages = [...this.product.images];
    }
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: [this.productData.name, [Validators.required]],
      description: [this.productData.description, [Validators.required]],
      price: [this.productData.price, [Validators.required, Validators.min(0)]],
      quantity: [this.productData.quantity, [Validators.required, Validators.min(0)]],
      categoryId: [this.productData.categoryId, [Validators.required]],
      isActive: [this.productData.isActive],
      images: [this.product?.images || []]
    });
  }

  private loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
        this.errorMessage = 'Failed to load categories';
      }
    });
  }

  onImagesUploaded(uploadedUrls: string[]): void {
    console.log('Received uploaded image URLs:', uploadedUrls);
    const currentImages = this.productForm.get('images')?.value || [];
    
    if (uploadedUrls && uploadedUrls.length > 0) {
      // Combine existing images with new ones
      const updatedImages = [...currentImages, ...uploadedUrls];
      this.productForm.patchValue({ images: updatedImages });
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      // Update selected files
      this.selectedFiles = Array.from(input.files);
      
      // Create preview URLs for the selected files
      for (const file of this.selectedFiles) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number, isExisting: boolean = false): void {
    if (isExisting) {
      // Remove from existing images
      const currentImages = this.productForm.get('images')?.value || [];
      const updatedImages = currentImages.filter((_: string, i: number) => i !== index);
      this.productForm.get('images')?.setValue(updatedImages);
      this.existingImages = updatedImages;
    } else {
      // Remove from newly selected files
      const updatedFiles = this.selectedFiles.filter((_, i) => i !== index);
      const updatedUrls = this.previewUrls.filter((_, i) => i !== index);
      
      this.selectedFiles = updatedFiles;
      this.previewUrls = updatedUrls;
    }
  }
  
  updateProduct(): void {
    if (!this.productForm.valid) {
      // Mark all controls as touched to show validation errors
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
      
      console.error('Form is invalid, cannot submit');
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = null;
    
    // Get form values
    const formValue = this.productForm.value;
    
    // Create product data from form
    const productToUpdate: ProductFormData = {
      name: formValue.name,
      price: formValue.price,
      quantity: formValue.quantity,
      description: formValue.description || '',
      isActive: formValue.isActive,
      categoryId: formValue.categoryId,
      sellerId: this.productData.sellerId
    };
    
    console.log('Updating product:', productToUpdate);
    
    this.productService.updateProduct(this.product._id, productToUpdate, this.selectedFiles)
      .subscribe({
        next: () => {
          console.log('Product updated successfully');
          this.isSubmitting = false;
          this.productUpdated.emit();
        },
        error: (error) => {
          console.error('Error updating product', error);
          this.errorMessage = error.message || 'An error occurred while updating the product';
          this.isSubmitting = false;
        }
      });
  }
  
  closeModal(): void {
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.updateProduct();
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.hasError('required'));
  }
}
