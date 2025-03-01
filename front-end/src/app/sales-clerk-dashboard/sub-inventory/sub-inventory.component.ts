import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SubInventoryItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  isActive: boolean;
  imageUrl: string;
  createdAt: Date;
}

@Component({
  selector: 'app-sub-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sub-inventory.component.html',
  styleUrls: ['./sub-inventory.component.css']
})
export class SubInventoryComponent implements OnInit {
  subInventoryItems: SubInventoryItem[] = [];
  filteredItems: SubInventoryItem[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  isLoading: boolean = true;

  ngOnInit(): void {
    this.loadSubInventory();
  }

  loadSubInventory(): void {
    // Static data for now
    setTimeout(() => {
      this.subInventoryItems = [
        {
          _id: '1',
          name: 'Chanel No. 5',
          description: 'Iconic fragrance with aldehydic floral notes',
          category: 'Women\'s Perfume',
          quantity: 8,
          price: 120,
          isActive: true,
          imageUrl: 'assets/images/products/chanel5.jpg',
          createdAt: new Date(2023, 5, 10)
        },
        {
          _id: '2',
          name: 'Dior Sauvage',
          description: 'Fresh and bold masculine fragrance',
          category: 'Men\'s Perfume',
          quantity: 12,
          price: 95,
          isActive: true,
          imageUrl: 'assets/images/products/dior-sauvage.jpg',
          createdAt: new Date(2023, 6, 15)
        },
        {
          _id: '3',
          name: 'Acqua di Gio',
          description: 'Light and airy marine-inspired fragrance',
          category: 'Men\'s Perfume',
          quantity: 5,
          price: 85,
          isActive: false,
          imageUrl: 'assets/images/products/acqua-di-gio.jpg',
          createdAt: new Date(2023, 7, 20)
        },
        {
          _id: '4',
          name: 'Marc Jacobs Daisy',
          description: 'Fresh and feminine with notes of wild berries',
          category: 'Women\'s Perfume',
          quantity: 3,
          price: 78,
          isActive: true,
          imageUrl: 'assets/images/products/marc-jacobs-daisy.jpg',
          createdAt: new Date(2023, 8, 5)
        },
        {
          _id: '5',
          name: 'Versace Eros',
          description: 'Bold and intense with mint and vanilla',
          category: 'Men\'s Perfume',
          quantity: 7,
          price: 90,
          isActive: true,
          imageUrl: 'assets/images/products/versace-eros.jpg',
          createdAt: new Date(2023, 9, 12)
        }
      ];
      this.filteredItems = [...this.subInventoryItems];
      this.isLoading = false;
    }, 1000);
  }

  applyFilters(): void {
    this.filteredItems = this.subInventoryItems.filter(item => {
      // Apply search term filter
      const searchMatch = !this.searchTerm || 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Apply status filter
      const statusMatch = this.statusFilter === 'all' || 
        (this.statusFilter === 'active' && item.isActive) || 
        (this.statusFilter === 'inactive' && !item.isActive);
      
      return searchMatch && statusMatch;
    });
    
    this.sortItems();
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      // If already sorting by this column, toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.sortItems();
  }

  sortItems(): void {
    this.filteredItems.sort((a: any, b: any) => {
      const valueA = a[this.sortColumn];
      const valueB = b[this.sortColumn];
      
      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'fas fa-sort';
    }
    return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }

  toggleStatus(item: SubInventoryItem): void {
    item.isActive = !item.isActive;
    
    // In a real implementation, you'd call an API to update the status
    // For now, just show an alert
    const status = item.isActive ? 'activated' : 'deactivated';
    alert(`${item.name} has been ${status}`);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }
}