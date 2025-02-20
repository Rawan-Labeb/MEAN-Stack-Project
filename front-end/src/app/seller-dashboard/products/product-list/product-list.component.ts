import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductFormData, DEFAULT_CATEGORIES, DEFAULT_CATEGORY } from '../../models/product.model';
import { AddProductComponent } from '../add-product/add-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EditProductComponent,
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
  selectedProduct?: Product;
  selectedFiles: File[] = [];
  error: string | null = null;
  private destroy$ = new Subject<void>();
  public readonly placeholderImage = 'https://dummyimage.com/50x50/e0e0e0/ffffff&text=No+Image';
  private readonly noImageIcon = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" fill="#9e9e9e"/>
    </svg>
  `)}`;

  productData: ProductFormData = {
    name: '',
    price: 0,
    quantity: 0,
    description: '',
    isActive: true,
    supplierId: '679bf428745c9d962586960e',
    categoryId: DEFAULT_CATEGORY,
    sellerId: '679bd316017427c66ece2617' // Hardcoded seller ID
  };

  sellerId: string = '679bd316017427c66ece2617'; // Hardcoded seller ID

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
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
    if (this.loading) return;
    
    this.loading = true;
    this.error = null;

    firstValueFrom(this.productService.getSellerProducts(this.sellerId))
      .then(data => {
        console.log('Raw products data:', JSON.stringify(data, null, 2));
        
        this.products = data.map(product => ({
          ...product,
          categoryId: product.categoryId || DEFAULT_CATEGORY,
          // Ensure images array exists
          images: product.images || []
        }));
        
        this.applyFilters();
      })
      .catch(error => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products';
      })
      .finally(() => {
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    console.log('Status filter changed to:', this.statusFilter);
    console.log('Before filtering:', this.products.length, 'products');
    this.applyFilters();
    console.log('After filtering:', this.filteredProducts.length, 'products');
    console.log('Filtered products:', this.filteredProducts);
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
    console.log('Starting filter - All products:', filtered.map(p => ({
      name: p.name,
      isActive: p.isActive,
      _id: p._id
    })));

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }

    if (this.statusFilter !== 'all') {
      console.log('Filtering by status:', this.statusFilter);
      filtered = filtered.filter(product => {
        const shouldBeActive = this.statusFilter === 'active';
        const isActive = Boolean(product.isActive);
        console.log(`Product ${product.name}: current isActive=${isActive}, shouldShow=${isActive === shouldBeActive}`);
        return isActive === shouldBeActive;
      });
    }

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

    this.filteredProducts = filtered;
    console.log('Final filtered products:', this.filteredProducts.map(p => ({
      name: p.name,
      isActive: p.isActive,
      _id: p._id
    })));
    this.cdr.detectChanges();
  }

  openAddModal(): void {
    this.productData = {
      name: '',
      price: 0,
      quantity: 0,
      description: '',
      isActive: true,
      supplierId: '679bf428745c9d962586960e',
      categoryId: DEFAULT_CATEGORY,
      sellerId: this.sellerId || ''
    };
    this.showAddModal = true;
  }

  openEditModal(product: Product): void {
    // Ensure product has a valid categoryId before opening edit modal
    this.selectedProduct = {
      ...product,
      categoryId: product.categoryId || DEFAULT_CATEGORY
    };
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

  async toggleStatus(product: Product): Promise<void> {
    try {
      const result = await Swal.fire({
        title: `${product.isActive ? 'Deactivate' : 'Activate'} Product`,
        text: `Are you sure you want to ${product.isActive ? 'deactivate' : 'activate'} ${product.name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      });

      if (result.isConfirmed) {
        const updatedProduct = await firstValueFrom(this.productService.toggleProductStatus(product._id));
        console.log('Toggle result:', updatedProduct);

        // Update local array
        const index = this.products.findIndex(p => p._id === product._id);
        if (index !== -1) {
          this.products[index] = {
            ...this.products[index],
            isActive: Boolean(updatedProduct.isActive)
          };
          console.log('Updated product in array:', this.products[index]);
        }

        // Show success message
        Swal.fire({
          title: 'Success!',
          text: `Product ${updatedProduct.isActive ? 'activated' : 'deactivated'} successfully`,
          icon: 'success',
          timer: 2000
        });

        // Reapply filters
        this.applyFilters();
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update product status',
        icon: 'error'
      });
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      const result = await Swal.fire({
        title: 'Delete Product',
        text: 'Are you sure you want to delete this product?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await firstValueFrom(this.productService.deleteProduct(productId));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Product has been deleted.',
          icon: 'success',
          timer: 2000
        });

        this.loadProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete product',
        icon: 'error'
      });
    }
  }

  sanitizeImageUrl(url: string): SafeUrl {
    if (!url) {
      console.log('No image URL provided');
      return this.placeholderImage;
    }
    
    console.log('Processing image URL:', url);
    
    try {
      // For ImageKit URLs, return as is
      if (url.includes('imagekit.io')) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
      }
      
      // For full URLs, return as is
      if (url.startsWith('http')) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
      }
      
      // For relative URLs, prepend the API base URL
      const fullUrl = `http://localhost:5000${url}`;
      console.log('Generated full URL:', fullUrl);
      return this.sanitizer.bypassSecurityTrustUrl(fullUrl);
    } catch (error) {
      console.error('Error processing image URL:', error);
      return this.placeholderImage;
    }
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && img.src !== this.placeholderImage) {
      img.src = this.placeholderImage;
      img.onerror = null;
    }
  }
}