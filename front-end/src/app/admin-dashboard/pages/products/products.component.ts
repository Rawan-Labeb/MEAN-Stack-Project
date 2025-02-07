import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../_services/product.service';
import { Product } from '../../../_models/product.model';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-products',
  imports:[CommonModule,FormsModule,RouterModule,MatIconModule,MatMenuModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']  
})
export class ProductsComponent{
  products: Product[] = [
      {
        _id: "1",
        name: "Gold Necklace",
        description: "Elegant 18K gold necklace with a beautiful pendant.",
        price: 499.99,
        prevPrice: 599.99,
        noOfSale: 120,
        images: ["gold-necklace-1.jpg", "gold-necklace-2.jpg"],
        isActive: true,
        quantity: 15,
        sellerId: "seller123",
        supplierId: "supplier456",
        categoryId: "jewelry",
      },
      {
        _id: "2",
        name: "Silver Bracelet",
        description: "Stylish sterling silver bracelet with a modern design.",
        price: 199.99,
        noOfSale: 80,
        images: ["silver-bracelet-1.jpg", "silver-bracelet-2.jpg"],
        isActive: true,
        quantity: 30,
        sellerId: "seller456",
        categoryId: "jewelry",
      },
      {
        _id: "3",
        name: "Diamond Ring",
        description: "Luxury diamond ring with a 1-carat gemstone.",
        price: 1299.99,
        prevPrice: 1499.99,
        noOfSale: 50,
        images: ["diamond-ring-1.jpg", "diamond-ring-2.jpg"],
        isActive: true,
        quantity: 10,
        sellerId: "seller789",
        supplierId: "supplier123",
        categoryId: "jewelry",
      },
      {
        _id: "4",
        name: "Pearl Earrings",
        description: "Classic pearl earrings with 14K gold studs.",
        price: 299.99,
        noOfSale: 95,
        images: ["pearl-earrings-1.jpg", "pearl-earrings-2.jpg"],
        isActive: false,
        quantity: 25,
        sellerId: "seller123",
        categoryId: "jewelry",
      },
      {
        _id: "5",
        name: "Gold Bangle Set",
        description: "Traditional gold bangles set of 4 pieces.",
        price: 699.99,
        prevPrice: 799.99,
        noOfSale: 65,
        images: ["gold-bangle-1.jpg", "gold-bangle-2.jpg"],
        isActive: false,
        quantity: 20,
        sellerId: "seller456",
        supplierId: "supplier789",
        categoryId: "jewelry",
      },
      {
        _id: "5",
        name: "Gold Bangle Set",
        description: "Traditional gold bangles set of 4 pieces.",
        price: 699.99,
        prevPrice: 799.99,
        noOfSale: 65,
        images: ["gold-bangle-1.jpg", "gold-bangle-2.jpg"],
        isActive: false,
        quantity: 20,
        sellerId: "seller456",
        supplierId: "supplier789",
        categoryId: "jewelry",
      },
      {
        _id: "5",
        name: "Gold Bangle Set",
        description: "Traditional gold bangles set of 4 pieces.",
        price: 699.99,
        prevPrice: 799.99,
        noOfSale: 65,
        images: ["gold-bangle-1.jpg", "gold-bangle-2.jpg"],
        isActive: false,
        quantity: 20,
        sellerId: "seller456",
        supplierId: "supplier789",
        categoryId: "jewelry",
      },
      {
        _id: "5",
        name: "Gold Bangle Set",
        description: "Traditional gold bangles set of 4 pieces.",
        price: 699.99,
        prevPrice: 799.99,
        noOfSale: 65,
        images: ["gold-bangle-1.jpg", "gold-bangle-2.jpg"],
        isActive: false,
        quantity: 20,
        sellerId: "seller456",
        supplierId: "supplier789",
        categoryId: "jewelry",
      },
    ];
      filteredProducts: Product[] = [];
      loading = false;
      searchTerm: string = '';
      sortColumn: keyof Product = 'name';
      sortDirection: 'asc' | 'desc' = 'asc';
      statusFilter: 'all' | 'active' | 'inactive' = 'all';
    
      constructor(private productService: ProductService) {}
    
      ngOnInit(): void {
        this.filteredProducts = [...this.products]; // استخدم البيانات المحلية
    this.applyFilters();
      }
    
      loadProducts(): void {
        this.loading = true;
        this.productService.getAllProducts().subscribe({
          next: (data: Product[]) => {
            this.products = data;
            this.filteredProducts = [...data];
            this.applyFilters();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading products:', error);
            this.loading = false;
          }
        });
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
              error: (error) => {
                console.error('Error deleting product:', error);
                Swal.fire('Error!', 'Failed to delete product.', 'error');
              }
            });
          }
        });
      }
    
      applyFilters(): void {
        let filtered = [...this.products];
    
        if (this.searchTerm) {
          filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) 
            ||product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        }
    
        if (this.statusFilter !== 'all') {
          filtered = filtered.filter(product => 
            product.isActive === (this.statusFilter === 'active')
          );
        }
    
        filtered.sort((a, b) => {
          const direction = this.sortDirection === 'asc' ? 1 : -1;
          if (typeof a[this.sortColumn] === 'number') {
            return ((a[this.sortColumn] as number) - (b[this.sortColumn] as number)) * direction;
          }
          return String(a[this.sortColumn]).localeCompare(String(b[this.sortColumn])) * direction;
        });
    
        this.filteredProducts = filtered;
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
}

