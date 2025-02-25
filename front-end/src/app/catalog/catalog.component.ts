import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SubInventoryServicesService } from '../_services/sub-inventory.services.service';
import { CategoryService } from '../_services/category.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  products: any[] = [];

  // Filtering and Sorting
  selectedCategory: string = ''; 
  sortBy: string = 'price-asc'; 

  // Pagination
  itemsPerPage: number = 4; 
  currentPage: number = 1; 

  // Computed Properties
  get filteredProducts(): any[] {
    return this.products.filter((product) =>
      !this.selectedCategory || product.productCategory === this.selectedCategory
    );
  }

  get sortedProducts(): any[] {
    const products = [...this.filteredProducts];
    if (this.sortBy === 'price-asc') {
      return products.sort((a, b) => a.productPrice - b.productPrice);
    } else if (this.sortBy === 'price-desc') {
      return products.sort((a, b) => b.productPrice - a.productPrice);
    } else if (this.sortBy === 'name-asc') {
      return products.sort((a, b) => a.productName.localeCompare(b.productName));
    } else if (this.sortBy === 'name-desc') {
      return products.sort((a, b) => b.productName.localeCompare(a.productName));
    }
    return products;
  }

  get paginatedProducts(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.sortedProducts.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.sortedProducts.length / this.itemsPerPage);
  }

  get paginationArray(): (number | string)[] {
    const maxVisiblePages = 5; // Maximum visible page numbers
    const pages = Array(this.totalPages).fill(0).map((_, i) => i + 1);

    if (pages.length <= maxVisiblePages) return pages;

    const start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(this.totalPages, start + maxVisiblePages - 1);

    const paginatedPages: (number | string)[] = [];
    if (start > 1) paginatedPages.push(1, '...');
    paginatedPages.push(...pages.slice(start - 1, end));
    if (end < this.totalPages) paginatedPages.push('...', this.totalPages);

    return paginatedPages;
  }

  constructor(
    private subInventorySer: SubInventoryServicesService,
    private categorySer: CategoryService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;

    // Subscribe to query parameters
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.selectedCategory = params.get('category') as string; // Get the 'category' parameter from the URL
      this.updateCategory(this.selectedCategory || ''); // Update the selected category
    });

    this.subInventorySer.getSubInventoryRelatedToBranch("Ecommerce").subscribe({
      next: (data) => {
        this.productRelatedtoBranch = data;
        console.log(data);

        // Fetch categories and map them to products
        const categoryRequests = this.productRelatedtoBranch.map((prod) =>
          this.categorySer.getCategoryById(prod.product.categoryId).toPromise()
        );

        Promise.all(categoryRequests)
          .then((categories) => {
            this.products = this.productRelatedtoBranch.map((prod, index) => ({
              productName: prod.product.name,
              productPrice: prod.product.price,
              productDescription: prod.product.description,
              productImage: prod.product.images || ['assets/default-image.jpg'], // Fallback for missing images
              productCategory: categories[index]?.name || 'men', // Handle missing categories
              //  productCategory:  'men', // Handle missing categories
              productQuantity: prod.quantity,
              noOfSale: prod.numberOfSales,
              _id: prod._id
            }));
          })
          .catch((error) => {
            console.error('Failed to retrieve categories', error);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false;
      }
    });
  }

  // Pagination Navigation
  goToPage(page: number | string): void {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page as number;
    }
  }

  // Update Sorting
  updateSort(sortBy: string): void {
    this.sortBy = sortBy;
    this.currentPage = 1; // Reset pagination when sorting changes
  }

  
  updateCategory(category: string): void {
    this.selectedCategory = category; // Set the selected category
    this.currentPage = 1; // Reset pagination when filtering changes
  }

  // Loading State
  loading: boolean = true;
  productRelatedtoBranch: any[] = [];
}