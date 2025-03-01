import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BranchProduct {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  isActive: boolean;
}

@Component({
  selector: 'app-branch-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './branch-products.component.html',
  styleUrls: ['./branch-products.component.css']
})
export class BranchProductsComponent implements OnInit {
  products: BranchProduct[] = [];
  filteredProducts: BranchProduct[] = [];
  searchTerm: string = '';
  categoryFilter: string = 'all';
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    // Static data for demonstration
    this.products = [
      {
        _id: 'bp1',
        name: 'Chanel No. 5',
        description: 'Iconic fragrance with aldehydic floral notes',
        category: 'Women\'s Perfume',
        price: 129.99,
        quantity: 10,
        image: 'assets/images/products/chanel5.jpg',
        isActive: true
      },
      {
        _id: 'bp2',
        name: 'Dior Sauvage',
        description: 'Fresh and bold masculine fragrance',
        category: 'Men\'s Perfume',
        price: 95.99,
        quantity: 15,
        image: 'assets/images/products/dior-sauvage.jpg',
        isActive: true
      },
      {
        _id: 'bp3',
        name: 'Acqua di Gio',
        description: 'Light and airy marine-inspired fragrance',
        category: 'Men\'s Perfume',
        price: 85.50,
        quantity: 8,
        image: 'assets/images/products/acqua-di-gio.jpg',
        isActive: true
      },
      {
        _id: 'bp4',
        name: 'Marc Jacobs Daisy',
        description: 'Fresh and feminine with notes of wild berries',
        category: 'Women\'s Perfume',
        price: 78.99,
        quantity: 12,
        image: 'assets/images/products/daisy.jpg',
        isActive: false
      },
      {
        _id: 'bp5',
        name: 'Versace Eros',
        description: 'Bold and intense with mint and vanilla',
        category: 'Men\'s Perfume',
        price: 90.99,
        quantity: 5,
        image: 'assets/images/products/versace-eros.jpg',
        isActive: true
      }
    ];
    
    this.applyFilters();
  }
  
  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      // Apply search filter
      const searchMatch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
        
      // Apply category filter
      const categoryMatch = this.categoryFilter === 'all' || product.category === this.categoryFilter;
      
      return searchMatch && categoryMatch;
    });
  }
  
  get categories(): string[] {
    const categories = new Set<string>();
    this.products.forEach(product => categories.add(product.category));
    return Array.from(categories);
  }
  
  toggleProductStatus(product: BranchProduct): void {
    product.isActive = !product.isActive;
    // In a real application, you would call an API to update the status
  }
}