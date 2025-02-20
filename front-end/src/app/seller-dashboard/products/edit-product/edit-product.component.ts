import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, ProductFormData, Category, DEFAULT_CATEGORIES } from '../../models/product.model';
import { firstValueFrom } from 'rxjs';
import { UploadComponent } from '../../../upload/upload.component'; 

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, UploadComponent]
})
export class EditProductComponent implements OnInit, OnChanges {
  @Input() product?: Product;
  @Input() show = false;
  @Output() productUpdated = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  productData: ProductFormData = {
    name: '',
    price: 0,
    quantity: 0,
    description: '',
    categoryId: DEFAULT_CATEGORIES[0], // Use default category
    supplierId: '679bf428745c9d962586960e',
    sellerId: '679bf428745c9d962586960a',
    isActive: true
  };

  loading = false;
  categories: Category[] = [];
  selectedFiles: File[] = [];
  imageUrls: string[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  private async loadCategories(): Promise<void> {
    try {
      this.categories = await firstValueFrom(this.categoryService.getCategories());
      console.log('Loaded categories:', this.categories);
      // If product exists, initialize form after categories are loaded
      if (this.product) {
        this.initializeForm();
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  ngOnChanges(): void {
    if (this.product) {
      console.log('Product received in edit modal:', this.product);
      this.initializeForm();
    }
  }

  private getCategoryId(category: Category | string): Category {
    if (typeof category === 'string') {
      return this.categories.find(c => c._id === category) || DEFAULT_CATEGORIES[0];
    }
    return category;
  }

  private getSupplierId(supplier: any | null): string {
    return supplier && '_id' in supplier ? supplier._id : '679bf428745c9d962586960e';
  }

  private getSellerId(seller: any | null): string {
    return seller && '_id' in seller ? seller._id : '679bf428745c9d962586960a';
  }

  async onSubmit(): Promise<void> {
    if (!this.product?._id) return;
    
    try {
      this.loading = true;

      const updateData: ProductFormData = {
        ...this.productData,
        images: [...this.productData.images || [], ...this.imageUrls]
      };

      const updatedProduct = await firstValueFrom(
        this.productService.updateProduct(this.product._id, updateData)
      );
      
      console.log('Product updated successfully:', updatedProduct);
      this.productUpdated.emit();
      this.closeModal.emit();
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert(error.message || 'Failed to update product');
    } finally {
      this.loading = false;
    }
  }

  onImagesUploaded(imageUrls: string[]): void {
    this.imageUrls = imageUrls;
  }

  onClose(): void {
    this.selectedFiles = [];
    this.closeModal.emit();
  }

  resetForm(): void {
    if (this.product) {
      this.productData = {
        name: this.product.name,
        price: this.product.price,
        quantity: this.product.quantity,
        description: this.product.description || '',
        categoryId: this.getCategoryId(this.product.categoryId),
        supplierId: this.getSupplierId(this.product.supplierId),
        sellerId: this.getSellerId(this.product.sellerId),
        isActive: this.product.isActive,
        images: this.product.images || []
      };
      this.selectedFiles = [];
    }
  }

  removeImage(index: number): void {
    if (this.productData.images) {
      this.productData.images = this.productData.images.filter((_, i) => i !== index);
    }
  }

  initializeForm(): void {
    if (this.product && this.categories.length > 0) {
      // Find the matching category from loaded categories
      const category = this.categories.find(c => c._id === this.product?.categoryId?._id) || this.categories[0];
      
      this.productData = {
        name: this.product.name,
        price: this.product.price,
        quantity: this.product.quantity,
        description: this.product.description || '',
        categoryId: category,
        supplierId: this.product.supplierId || '679bf428745c9d962586960e',
        sellerId: this.product.sellerId || '679bf428745c9d962586960a',
        isActive: this.product.isActive,
        images: this.product.images || []
      };
      console.log('ProductData initialized:', this.productData);
    }
  }

  isSameCategory(cat1: any, cat2: any): boolean {
    return cat1?._id === cat2?._id;
  }
}
