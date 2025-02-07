import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../_services/product.service';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../../../_models/product.model';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule,CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  // @Input() show = false;
  // @Input() productData: Product = {
  //   name: '',
  //   description: '',
  //   price: 0,
  //   quantity: 0,
  //   categoryId: '679bf428745c9d962586960c', // Default category
  //   sellerId: '679bd316017427c66ece2617',   // Default seller
  //   supplierId: '679bf428745c9d962586960e', // Default supplier
  //   isActive: true
  // };
  // @Output() close = new EventEmitter<void>();
  // @Output() saved = new EventEmitter<void>();

  // loading = false;

  // constructor(private productService: ProductService) {}

  // async onSubmit(): Promise<void> {
  //   try {
  //     this.loading = true;
      
  //     // Validate data
  //     if (this.productData.price <= 0 || this.productData.quantity <= 0) {
  //       throw new Error('Price and quantity must be positive numbers');
  //     }

  //     // Create product object
  //     const productData = {
  //       name: this.productData.name.trim(),
  //       description: this.productData.description?.trim(),
  //       price: this.productData.price,
  //       quantity: this.productData.quantity,
  //       categoryId: this.productData.categoryId,
  //       sellerId: this.productData.sellerId,
  //       supplierId: this.productData.supplierId,
  //       isActive: this.productData.isActive
  //     };

  //     await firstValueFrom(this.productService.createProduct(productData));
  //     this.saved.emit();
  //     this.close.emit();
  //   } catch (error) {
  //     console.error('Error adding product:', error);
  //   } finally {
  //     this.loading = false;
  //   }
  // }

  // onClose(): void {
  //   this.close.emit();
  // }
}
