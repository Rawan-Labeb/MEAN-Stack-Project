import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category, ProductFormData } from '../../models/product.model';
import { AddProductComponent } from '../add-product/add-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddProductComponent,
    EditProductComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  // Products
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  
  // UI state
  loading = false;
  error: string | null = null;
  searchTerm = '';
  
  // Sorting
  sortColumn = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Editing
  editingProduct: Product | null = null;
  showAddModal = false;
  showEditModal = false;
  
  // Add this property for the product form
  productData: ProductFormData = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId: '',
    isActive: true
  };
  
  // Status filter
  activeFilter: 'all' | 'active' | 'inactive' = 'all';
  
  // Subscription management
  private productUpdateSubscription: Subscription | null = null;
  
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}
  
  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.subscribeToProductUpdates();
  }
  
  ngOnDestroy(): void {
    if (this.productUpdateSubscription) {
      this.productUpdateSubscription.unsubscribe();
    }
  }
  
  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }
  
  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.applyFilters();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      }
    });
  }
  
  // Add these methods for modal management
  openAddModal(): void {
    // Reset form data
    this.productData = {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      categoryId: '',
      isActive: true
    };
    this.showAddModal = true;
  }
  
  closeAddModal(): void {
    this.showAddModal = false;
  }
  
  onProductSaved(): void {
    this.closeAddModal();
    this.loadProducts();
  }
  
  openEditModal(product: Product): void {
    this.editingProduct = { ...product };
    // Set form data for editing
    this.productData = {
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categoryId: typeof product.categoryId === 'string' 
        ? product.categoryId 
        : (product.categoryId as Category)._id,
      isActive: product.isActive
    };
    this.showEditModal = true;
  }
  
  closeEditModal(): void {
    this.showEditModal = false;
    this.editingProduct = null;
  }
  
  onProductUpdated(): void {
    this.closeEditModal();
    this.loadProducts();
  }
  
  subscribeToProductUpdates(): void {
    this.productUpdateSubscription = this.productService.productUpdates$.subscribe(() => {
      this.loadProducts();
    });
  }
  
  applyFilters(): void {
    // Filter by search term and status
    this.filteredProducts = this.products.filter(product => {
      // Filter by search term
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
        
      // Filter by status
      const matchesStatus = 
        this.activeFilter === 'all' || 
        (this.activeFilter === 'active' && product.isActive) ||
        (this.activeFilter === 'inactive' && !product.isActive);
        
      return matchesSearch && matchesStatus;
    });
    
    // Sort the results
    this.sortProducts();
  }
  
  filterByStatus(status: 'all' | 'active' | 'inactive'): void {
    this.activeFilter = status;
    this.applyFilters();
  }
  
  onSearch(): void {
    this.applyFilters();
  }
  
  sort(column: string): void {
    if (this.sortColumn === column) {
      // Toggle sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.sortProducts();
  }
  
  sortProducts(): void {
    this.filteredProducts.sort((a, b) => {
      const valueA = this.getSortValue(a, this.sortColumn);
      const valueB = this.getSortValue(b, this.sortColumn);
      
      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  
  getSortValue(product: Product, column: string): any {
    switch (column) {
      case 'name':
        return product.name.toLowerCase();
      case 'price':
        return product.price;
      case 'quantity':
        return product.quantity;
      case 'description':
        return product.description ? product.description.toLowerCase() : '';
      default:
        return product[column as keyof Product];
    }
  }
  
  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'fas fa-sort';
    }
    return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }
  
  getCategoryName(product: Product): string {
    if (!product.categoryId) {
      return 'Uncategorized';
    }
    
    // If category is already populated (as an object)
    if (typeof product.categoryId === 'object' && product.categoryId !== null) {
      return product.categoryId.name || 'Unknown';
    }
    
    // If category is just an ID
    const category = this.categories.find(cat => cat._id === product.categoryId);
    return category ? category.name : 'Unknown';
  }
  
  deleteProduct(product: Product): void {
    Swal.fire({
      title: 'Delete Product?',
      text: `Are you sure you want to delete ${product.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(product._id).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'Product deleted successfully.',
              'success'
            );
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            Swal.fire(
              'Error!',
              `Failed to delete product: ${error.message}`,
              'error'
            );
          }
        });
      }
    });
  }
  
  toggleProductStatus(product: Product): void {
    const action = product.isActive ? 'deactivate' : 'activate';
    
    Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Product?`,
      text: `Are you sure you want to ${action} ${product.name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: product.isActive ? '#d33' : '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Yes, ${action} it!`
    }).then((result) => {
      if (result.isConfirmed) {
        const request = product.isActive 
          ? this.productService.deactivateProduct(product._id)
          : this.productService.activateProduct(product._id);
          
        request.subscribe({
          next: () => {
            Swal.fire(
              'Success!',
              `Product ${action}d successfully.`,
              'success'
            );
            this.loadProducts();
          },
          error: (error) => {
            console.error(`Error ${action}ing product:`, error);
            Swal.fire(
              'Error!',
              `Failed to ${action} product: ${error.message}`,
              'error'
            );
          }
        });
      }
    });
  }

  // Add this method to handle image loading errors
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    
    // Hide the broken image and show the no-image div instead
    imgElement.style.display = 'none';
    
    // Create and show a no-image div
    const parentElement = imgElement.parentElement;
    if (parentElement) {
      const noImageDiv = document.createElement('div');
      noImageDiv.className = 'no-image';
      
      const icon = document.createElement('i');
      icon.className = 'fas fa-image text-muted';
      
      noImageDiv.appendChild(icon);
      parentElement.appendChild(noImageDiv);
    }
  }

  // Add this method to validate image URLs
  isValidImage(url: string): boolean {
    // Simple validation to check if the URL starts with http or https
    return !!url && (url.startsWith('http://') || url.startsWith('https://'));
  }
}