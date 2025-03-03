import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category, ProductFormData } from '../../models/product.model';
import { SellerUploadComponent } from '../../components/seller-upload/seller-upload.component';
import { Router } from '@angular/router';
// Import CookieService properly
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SellerUploadComponent]
})
export class AddProductComponent implements OnInit {
  @Input() productData!: ProductFormData;
  @Output() close = new EventEmitter<void>();
  @Output() productSaved = new EventEmitter<void>();
  
  productForm!: FormGroup;
  categories: Category[] = [];
  loading = false;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  errorMessage: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    
    // Check token status
    const token = localStorage.getItem('token');
    const cookieToken = this.cookieService.get('token');
    
    console.log('Token check:', {
      hasLocalStorageToken: !!token,
      hasCookieToken: !!cookieToken,
      localStorageTokenLength: token ? token.length : 0,
      cookieTokenLength: cookieToken ? cookieToken.length : 0
    });
    
    if (token) {
      try {
        // Log decoded token info
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Decoded token info:', {
            sub: payload.sub,
            role: payload.role,
            exp: new Date(payload.exp * 1000).toLocaleString(),
            isExpired: payload.exp * 1000 < Date.now()
          });
        }
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
  }

  private initForm(): void {
    // Initialize with values from productData if available
    this.productForm = this.fb.group({
      name: [this.productData?.name || '', [Validators.required]],
      description: [this.productData?.description || '', [Validators.required]],
      price: [this.productData?.price || 0, [Validators.required, Validators.min(0)]],
      quantity: [this.productData?.quantity || 0, [Validators.required, Validators.min(0)]],
      categoryId: [this.productData?.categoryId || '', [Validators.required]],
      isActive: [this.productData?.isActive !== undefined ? this.productData.isActive : true],
      images: [[]]
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

  // Fix the method that was causing the "patchValue" error
  onImagesUploaded(uploadedUrls: string[]): void {
    if (uploadedUrls && uploadedUrls.length > 0) {
      // Get current images from form
      const currentImages = this.productForm.get('images')?.value || [];
      
      // Combine existing images with new ones
      const updatedImages = [...currentImages, ...uploadedUrls];
      
      // Use productForm (not productData) to call patchValue
      this.productForm.patchValue({ images: updatedImages });
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      // Update selected files
      this.selectedFiles = Array.from(input.files);
      
      // Clear existing preview URLs
      this.previewUrls = [];
      
      // Create preview URLs for the selected files
      for (const file of this.selectedFiles) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
      
      // Update the form control
      this.productForm.get('images')?.setValue(this.selectedFiles);
    }
  }

  removeImage(index: number): void {
    // Create new arrays without the removed file
    const updatedFiles = this.selectedFiles.filter((_, i) => i !== index);
    const updatedUrls = this.previewUrls.filter((_, i) => i !== index);
    
    // Update component properties
    this.selectedFiles = updatedFiles;
    this.previewUrls = updatedUrls;
    
    // Update the form control
    this.productForm.get('images')?.setValue(this.selectedFiles);
  }
  
  saveProduct(): void {
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
    
    // Check if we have a valid token before attempting to create the product
    const token = this.cookieService.get('token') || localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'You need to be logged in to create a product';
      this.isSubmitting = false;
      
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to create products',
        icon: 'error',
        confirmButtonText: 'Go to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
      
      return;
    }
    
    // Create product data from form
    const productToSave: ProductFormData = {
      name: formValue.name,
      price: formValue.price,
      quantity: formValue.quantity,
      description: formValue.description || '',
      isActive: formValue.isActive,
      categoryId: formValue.categoryId,
      sellerId: this.productData?.sellerId || localStorage.getItem('userId') || ''
    };
    
    console.log('Saving product with seller ID:', productToSave.sellerId);
    
    this.productService.createProduct(productToSave, this.selectedFiles)
      .subscribe({
        next: (response) => {
          console.log('Product created successfully:', response);
          this.isSubmitting = false;
          
          Swal.fire({
            title: 'Success!',
            text: 'Product created successfully',
            icon: 'success',
            timer: 2000
          });
          
          this.productSaved.emit();
        },
        error: (error) => {
          console.error('Error creating product:', error);
          
          // Handle authentication errors specifically
          if (error.status === 401) {
            this.errorMessage = 'Authentication failed. Please log in again.';
            
            Swal.fire({
              title: 'Session Expired',
              text: 'Your login session has expired. Please log in again.',
              icon: 'warning',
              confirmButtonText: 'Go to Login'
            }).then((result) => {
              if (result.isConfirmed) {
                // Clear any existing tokens
                this.cookieService.delete('token');
                localStorage.removeItem('token');
                
                // Redirect to login
                this.router.navigate(['/login']);
              }
            });
          } else {
            // Handle general errors - Fix SweetAlert error by ensuring text is never null
            const errorMessage = error.error?.message || error.message || 'An error occurred while creating the product';
            this.errorMessage = errorMessage;
            
            Swal.fire({
              title: 'Error',
              text: errorMessage, // This is now guaranteed to be a string
              icon: 'error'
            });
          }
          
          this.isSubmitting = false;
        }
      });
  }
  
  closeModal(): void {
    this.close.emit();
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (!field) return '';
    
    if (field.hasError('required')) return 'This field is required';
    if (field.hasError('min')) return 'Value must be greater than or equal to 0';
    
    return 'Invalid field';
  }
}
