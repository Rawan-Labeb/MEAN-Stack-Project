import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductFormData } from '../../models/product.model';
import { Category } from '../../models/product.model';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditProductComponent implements OnInit, OnChanges {
  @Input() show = false;
  @Input() product?: Product;
  @Output() closeModal = new EventEmitter<void>();
  @Output() productUpdated = new EventEmitter<void>();

  categories: Category[] = [];
  selectedFiles: File[] = [];
  existingImages: string[] = [];
  loading = false;
  productData: ProductFormData = {
    name: '',
    price: 0,
    quantity: 0,
    description: '',
    isActive: true,
    supplierId: '679bf428745c9d962586960e',
    categoryId: '679bf428745c9d962586960c',
    sellerId: '679bd316017427c66ece2617'
  };

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnChanges(): void {
    if (this.product) {
      // Set form data without images
      this.productData = {
        name: this.product.name,
        price: this.product.price,
        quantity: this.product.quantity,
        categoryId: this.product.categoryId,
        description: this.product.description,
        isActive: this.product.isActive,
        supplierId: this.product.supplierId,
        sellerId: this.product.sellerId
      };
      
      // Handle images separately
      this.existingImages = this.product.images || [];
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  onFileChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files) {
      this.selectedFiles = Array.from(element.files);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.product?._id) return;
    
    try {
      this.loading = true;
      
      // Validate data before update
      if (this.productData.price < 0 || this.productData.quantity < 0) {
        throw new Error('Price and quantity must be positive numbers');
      }

      // Create update object
      const updateData = {
        name: this.productData.name.trim(),
        price: this.productData.price,
        quantity: this.productData.quantity,
        description: this.productData.description?.trim(),
        isActive: this.productData.isActive,
        supplierId: this.productData.supplierId
      };

      const updatedProduct = await firstValueFrom(
        this.productService.updateProduct(this.product._id, updateData)
      );
      
      console.log('Product updated successfully:', updatedProduct);
      this.productUpdated.emit();
      this.closeModal.emit();
    } catch (error) {
      console.error('Error updating product:', error);
      // Here you could add a notification service to show error messages
    } finally {
      this.loading = false;
    }
  }

  resetForm(): void {
    if (this.product) {
      this.productData = {
        name: this.product.name,
        price: this.product.price,
        quantity: this.product.quantity,
        categoryId: this.product.categoryId,
        description: this.product.description || '',
        isActive: this.product.isActive,
        supplierId: this.product.supplierId,
        sellerId: this.product.sellerId
      };
    }
  }

  onClose(): void {
    this.selectedFiles = [];
    this.closeModal.emit();
  }
}
