import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AuthServiceService } from '../../../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';
import { Product } from '../../models/product.model';
import { AddProductComponent } from '../add-product/add-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EditProductComponent,
    AddProductComponent,
    DeleteProductComponent
  ]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  showAddModal = false;
  showEditModal = false;
  loading = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private authService: AuthServiceService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    const token = this.cookieService.get('token');
    if (!token) {
      this.error = 'Not authenticated';
      this.loading = false;
      return;
    }

    try {
      const decodedToken = this.authService.decodeToken(token);
      const sellerId = decodedToken.id;

      this.productService.getSellerProducts(sellerId).subscribe({
        next: (products) => {
          this.products = products;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.error = 'Failed to load products';
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error decoding token:', error);
      this.error = 'Authentication error';
      this.loading = false;
    }
  }

  onProductSaved(): void {
    this.loadProducts();
  }

  onAddProduct(): void {
    this.showAddModal = true;
  }

  onEditProduct(product: Product): void {
    this.selectedProduct = product;
    this.showEditModal = true;
  }

  toggleProductStatus(product: Product): void {
    if (product.isActive) {
      this.productService.deactivateProduct(product._id).subscribe({
        next: () => this.loadProducts(),
        error: (error) => console.error('Error deactivating product:', error)
      });
    } else {
      this.productService.activateProduct(product._id).subscribe({
        next: () => this.loadProducts(),
        error: (error) => console.error('Error activating product:', error)
      });
    }
  }

  onModalClosed(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedProduct = null;
  }

  onProductDeleted(): void {
    this.loadProducts();
  }
}