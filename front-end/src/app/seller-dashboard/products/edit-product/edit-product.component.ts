import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, ProductFormData, Category } from '../../models/product.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
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
    categoryId: '',
    supplierId: '679bf428745c9d962586960e',
    sellerId: '679bf428745c9d962586960a',
    isActive: true
  };

  loading = false;
  categories: Category[] = [];
  selectedFiles: File[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.resetForm();
  }

  private async loadCategories(): Promise<void> {
    try {
      this.categories = await firstValueFrom(this.categoryService.getCategories());
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  ngOnChanges(): void {
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
        images: this.product.images
      };
    }
  }

  private getCategoryId(category: Category | null): string {
    return category && '_id' in category ? category._id : '';
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
        name: this.productData.name?.trim() || '',
        description: this.productData.description?.trim() || '',
        price: Number(this.productData.price),
        quantity: Number(this.productData.quantity),
        sellerId: '679bf428745c9d962586960a',
        supplierId: '679bf428745c9d962586960e',
        categoryId: this.productData.categoryId,
        isActive: Boolean(this.productData.isActive),
        images: this.productData.images
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

  onFileChange(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files?.length) {
      this.selectedFiles = Array.from(element.files);
    }
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
        isActive: this.product.isActive
      };
      this.selectedFiles = [];
    }
  }
}
