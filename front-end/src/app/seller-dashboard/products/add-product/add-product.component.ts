import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { SellerUploadService } from '../../services/seller-upload.service';
import { firstValueFrom } from 'rxjs';
import { ProductFormData, Category, DEFAULT_CATEGORIES, DEFAULT_CATEGORY, ProductSubmitData } from '../../models/product.model';
import { CategoryService } from '../../services/category.service';
import Swal from 'sweetalert2';
import { SellerUploadComponent } from '../../components/seller-upload/seller-upload.component';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, SellerUploadComponent],
  templateUrl: './add-product.component.html'
})
export class AddProductComponent implements OnInit {
  @Input() show = false;
  @Input() productData: ProductFormData = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId: DEFAULT_CATEGORY,
    sellerId: '679bd316017427c66ece2617', // Hardcoded seller ID
    supplierId: '679bf428745c9d962586960e',
    isActive: true
  };
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  loading = false;

  categories: Category[] = [];
  imageUrls: string[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private uploadService: SellerUploadService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.loading = true;
    this.categoryService.getActiveCategories().subscribe({
      next: (categories) => {
        console.log('Loaded categories:', categories);
        if (categories && categories.length > 0) {
          this.categories = categories;
          if (!this.productData.categoryId?._id) {
            this.productData.categoryId = categories[0];
          }
        } else {
          this.categories = DEFAULT_CATEGORIES;
          this.productData.categoryId = DEFAULT_CATEGORY;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = DEFAULT_CATEGORIES;
        this.productData.categoryId = DEFAULT_CATEGORY;
        this.loading = false;
      }
    });
  }

  onImagesUploaded(uploadedUrls: string[]): void {
    console.log('Received uploaded image URLs:', uploadedUrls);
    if (uploadedUrls && uploadedUrls.length > 0) {
      this.imageUrls = uploadedUrls;
      
      // Update the productData with the new images
      this.productData = {
        ...this.productData,
        images: uploadedUrls
      };
      console.log('Updated product data with images:', this.productData);
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      try {
        const uploadPromises = Array.from(input.files).map(file => 
          firstValueFrom(this.productService.uploadProductImage(file))
        );
        
        const results = await Promise.all(uploadPromises);
        this.imageUrls = results.flat();
        console.log('Uploaded image URLs:', this.imageUrls);
      } catch (error) {
        console.error('Error uploading images:', error);
        // Handle error
      }
    }
  }

  async onSubmit(): Promise<void> {
    try {
      if (!this.productData.categoryId?._id) {
        Swal.fire({
          title: 'Error!',
          text: 'Please select a category',
          icon: 'error'
        });
        return;
      }

      // Check if we have images in productData instead of imageUrls
      if (!this.productData.images?.length) {
        Swal.fire({
          title: 'Warning',
          text: 'Please upload at least one image',
          icon: 'warning'
        });
        return;
      }

      Swal.fire({
        title: 'Adding Product...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const productData: ProductSubmitData = {
        ...this.productData,
        images: this.productData.images, // Use images from productData
        categoryId: this.productData.categoryId._id
      };

      console.log('Submitting product with images:', productData);
      const result = await firstValueFrom(this.productService.addProduct(productData));
      console.log('Product creation response:', result);

      await Swal.fire({
        title: 'Success!',
        text: 'Product added successfully',
        icon: 'success',
        timer: 2000
      });

      this.saved.emit();
      this.close.emit();
    } catch (error) {
      console.error('Error creating product:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add product',
        icon: 'error'
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
