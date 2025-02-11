import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductFormData } from '../../models/product.model';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EditProductComponent,
    DeleteProductComponent,
    AddProductComponent
  ]
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  statusFilter = 'all';
  sortColumn: keyof Product = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading = false;
  showAddModal = false;
  showEditModal = false;
  editingProduct?: Product;
  selectedProduct?: Product; // Add this property
  selectedFiles: File[] = [];
  error: string | null = null;
  private destroy$ = new Subject<void>();

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

  // Add sellerId property
  sellerId = '679bd316017427c66ece2617'; // This should come from auth service

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.subscribeToProductUpdates();
  }

  subscribeToProductUpdates(): void {
    this.productService.onProductUpdate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadProducts();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    firstValueFrom(this.productService.getSellerProducts(this.sellerId))
      .then(data => {
        console.log('Seller Products loaded:', data);
        this.products = [...data];
        this.filteredProducts = [...data];
        this.applyFilters();
        this.cdr.detectChanges();
      })
      .catch(error => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products';
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  sort(column: keyof Product): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'fas fa-sort';
    return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }

  applyFilters(): void {
    let filtered = [...this.products];

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(product => 
        product.isActive === (this.statusFilter === 'active')
      );
    }

    // Apply sorting with type safety
    if (this.sortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[this.sortColumn];
        const bValue = b[this.sortColumn];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        const direction = this.sortDirection === 'asc' ? 1 : -1;
        if (typeof aValue === 'string') {
          return direction * aValue.localeCompare(String(bValue));
        }
        return direction * (Number(aValue) - Number(bValue));
      });
    }

    this.filteredProducts = [...filtered]; // Create new array reference
    this.cdr.detectChanges(); // Force change detection
  }

  openAddModal(): void {
    this.productData = {
      name: '',
      price: 0,
      quantity: 0,
      description: '',
      isActive: true,
      supplierId: '679bf428745c9d962586960e',
      categoryId: '679bf428745c9d962586960c',
      sellerId: '679bd316017427c66ece2617'
    };
    this.showAddModal = true;
  }

  openEditModal(product: Product): void {
    this.selectedProduct = product;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.selectedProduct = undefined;
    this.showEditModal = false;
  }

  onProductSaved(): void {
    this.loadProducts();
    this.showAddModal = false;
  }

  onProductUpdated(): void {
    if (this.selectedProduct) {
      const index = this.products.findIndex(p => p._id === this.selectedProduct!._id);
      if (index !== -1) {
        this.products[index] = { ...this.selectedProduct };
      }
    }
    this.applyFilters();
    this.closeEditModal();
  }
}