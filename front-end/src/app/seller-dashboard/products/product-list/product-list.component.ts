import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductFormData } from '../../models/product.model';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  // Add this
    RouterModule,
    DeleteProductComponent,
    AddProductComponent,
    EditProductComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
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
  editingProduct: Product | null = null;
  selectedFiles: File[] = [];
  error: string | null = null;
  private destroy$ = new Subject<void>();

  productData: ProductFormData = {
    name: '',
    price: 0,
    quantity: 0,
    images:[],
    description: '',
    isActive: true,
    categoryId: '679bf428745c9d962586960c',
    sellerId: '679bd316017427c66ece2617'
  };

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.subscribeToProductUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeToProductUpdates(): void {
    this.productService.onProductUpdate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadProducts();
      });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Product[]) => {
          this.products = data;
          this.filteredProducts = data;
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.error = 'Failed to load products. Please try again later.';
          this.loading = false;
        }
      });
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

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // For numbers or other types
      const aNum = Number(aValue);
      const bNum = Number(bValue);
      return this.sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    });

    this.filteredProducts = filtered;
    this.cdr.detectChanges();
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

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // For numbers or other types
      const aNum = Number(aValue);
      const bNum = Number(bValue);
      return this.sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    });

    this.filteredProducts = filtered;
    this.cdr.detectChanges();
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
    if (this.sortColumn !== column) return 'bi bi-sort';
    return this.sortDirection === 'asc' ? 'bi bi-sort-up' : 'bi bi-sort-down';
  }

  openAddModal(): void {
    console.log('Opening add product modal');
    this.productData = {
      name: '',
      price: 0,
      quantity: 0,
      images:[],
      description: '',
      isActive: true,
      categoryId: '679bf428745c9d962586960c',
      sellerId: '679bd316017427c66ece2617'
    };
    this.showAddModal = true;
    this.cdr.detectChanges();
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.cdr.detectChanges();
  }

  openEditModal(product: Product): void {
    console.log('Opening edit product modal for:', product);
    this.editingProduct = { ...product };
    this.productData = {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      description: product.description || '',
      isActive: product.isActive,
      categoryId: typeof product.categoryId === 'string' ? product.categoryId : product.categoryId._id,
      sellerId: product.sellerId
    };
    this.showEditModal = true;
    this.cdr.detectChanges();
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingProduct = null;
    this.cdr.detectChanges();
  }

  onProductSaved(): void {
    this.closeAddModal();
    this.loadProducts();
  }

  onProductUpdated(): void {
    this.closeEditModal();
    this.loadProducts();
  }
}