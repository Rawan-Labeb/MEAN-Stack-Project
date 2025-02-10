import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../_services/product.service';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../../../_models/product.model';
import { ToastrService } from 'ngx-toastr';
import { UploadComponent } from 'src/app/upload/upload.component';
import { CategoryService } from 'src/app/_services/category.service';
import { Category } from 'src/app/_models/category.model';

@Component({
  selector: 'app-update-product',
  imports: [FormsModule, CommonModule, UploadComponent],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent implements OnInit{
  categories: Category[] = [];

  @Input() show = false;
  @Input() productData!: Product; // Ensure productData is passed as an input

  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  loading = false;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategoriesActive().subscribe({
      next: (response) => {
        this.categories = response;
        console.log('✅ Categories loaded:', this.categories);
      },
      error: (error) => console.error('❌ Error fetching categories:', error)
    });
  }

  onImagesUploaded(imageUrls: string[]) {
    this.productData.images = imageUrls;
  }

  async onSubmit(): Promise<void> {
    try {
      this.loading = true;

      // Ensure we update the correct product
      const updatedProduct: Product = {
        ...this.productData,
        name: this.productData.name.trim(),
        description: this.productData.description?.trim() || '',
      };

      // Call update method instead of create
      await firstValueFrom(this.productService.updateProduct(this.productData._id, updatedProduct));

      this.toastr.success('Product updated successfully!', 'Success');
      this.updated.emit(); // Emit event for success
      this.close.emit();
    } catch (error) {
      console.error('Error updating product:', error);
      this.toastr.error('Failed to update product. Please try again.', 'Error');
    } finally {
      this.loading = false;
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
