import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-delete-product',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="btn btn-sm btn-danger" (click)="deleteProduct()">Delete</button>
  `
})
export class DeleteProductComponent {
  @Input() productId!: string;
  @Output() deleted = new EventEmitter<void>();

  constructor(private productService: ProductService) {}

  deleteProduct(): void {
    if (!this.productId) return;
    
    this.productService.deleteProduct(this.productId).subscribe({
      next: () => this.deleted.emit(),
      error: (error: Error) => console.error('Error deleting product:', error)
    });
  }
}