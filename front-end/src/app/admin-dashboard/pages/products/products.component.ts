import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../_services/product.service';
import { Product } from '../../../_models/product.model';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AddProductComponent } from './add-product/add-product.component';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UpdateProductComponent } from './update-product/update-product.component';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, MatMenuModule, AddProductComponent, UpdateProductComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  searchTerm: string = '';
  sortColumn: keyof Product = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  showAddModal = false;
  showEditModal = false;
  editingProduct?: Product;
  selectedFiles: File[] = [];
  error: string | null = null;
  private destroy$ = new Subject<void>();

  productData: Product = this.getInitialProductData();

  constructor(private productService: ProductService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProducts();
    this.subscribeToProductUpdates();
  }

  getInitialProductData(): Product {
    return {
      _id: '',
      name: '',
      price: 0,
      sellerId: {_id:'679bd316017427c66ece2617',firstName:'',lastName:''},
      categoryId: {_id:'',name:''},
      description: '',
      prevPrice: 0,
      noOfSale: 0,
      images: [],
      isActive: true,
      quantity: 0,
      supplierId: '679bf428745c9d962586960e'
    };
  }

  subscribeToProductUpdates(): void {
    this.productService.onProductUpdate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadProducts());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadProducts(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const data = await firstValueFrom(this.productService.getAllProducts());
      this.products = [...data];
      this.filteredProducts = [...data];
      this.applyFilters();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading products:', error);
      this.error = 'Failed to load products';
    } finally {
      this.loading = false;
    }
  }

  deleteProduct(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.loadProducts();
            Swal.fire('Deleted!', 'Product has been deleted.', 'success');
          },
          error: () => Swal.fire('Error!', 'Failed to delete product.', 'error')
        });
      }
    });
  }
  activeProduct(id: string): void {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.loadProducts();
          },
          error:(error) => console.error('❌ Error:', error)
        });
      }
  
  get activeProductsCount(): number {
    return this.products.filter(product => product.isActive === true).length;
  }

  get inactiveproductCount(): number {
    return this.products.filter(product => product.isActive === false).length;
  }

  get inStockProductsCount(): number {
    return this.products.filter(product => product.quantity > 0).length;
  }
  
  get outOfStockProductsCount(): number {
    return this.products.filter(product => product.quantity === 0).length;
  }
  

  applyFilters(): void {
    let filtered = [...this.products];
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower)
      );
    }
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(product => product.isActive === (this.statusFilter === 'active'));
    }
    filtered.sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];
      if (aValue == null || bValue == null) return 0;
      const direction = this.sortDirection === 'asc' ? 1 : -1;
      return typeof aValue === 'string' ? direction * aValue.localeCompare(String(bValue)) : direction * ((aValue as number) - (bValue as number));
    });
    this.filteredProducts = [...filtered];
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

  openAddModal(): void {
    this.productData = this.getInitialProductData();
    this.showAddModal = true;
  }

  openEditModal(product: Product): void {
    this.editingProduct = product;
    this.productData = { ...product };
    this.showEditModal = true;
    console.log("✅ Opening Edit Modal with Data:", this.productData);
  }

  onProductSaved(): void {
    this.loadProducts();
    this.showAddModal = false;
  }

  onProductUpdated(): void {
    this.showEditModal = false;
    this.loadProducts();
  }
}


