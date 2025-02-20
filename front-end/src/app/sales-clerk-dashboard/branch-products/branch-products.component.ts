import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BranchProduct {
  id: string;
  name: string;
  stock: number;
  price: number;
  inventoryName: string;
  lastRestocked: string;
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
  products: BranchProduct[] = [
    {
      id: '1',
      name: 'CHANEL N°5 Eau de Parfum',
      stock: 15,
      price: 299.99,
      inventoryName: 'Main Storage',
      lastRestocked: '2024-02-14',
      isActive: true
    },
    {
      id: '2',
      name: 'Dior Sauvage Eau de Parfum',
      stock: 8,
      price: 155.00,
      inventoryName: 'Display Area',
      lastRestocked: '2024-02-15',
      isActive: true
    },
    {
      id: '3',
      name: 'Yves Saint Laurent Black Opium',
      stock: 12,
      price: 185.00,
      inventoryName: 'Main Storage',
      lastRestocked: '2024-02-16',
      isActive: false
    },
    {
      id: '4',
      name: 'Giorgio Armani Si Passione',
      stock: 5,
      price: 128.00,
      inventoryName: 'Main Storage',
      lastRestocked: '2024-02-13',
      isActive: true
    },
    {
      id: '5',
      name: 'Tom Ford Black Orchid',
      stock: 0,
      price: 245.00,
      inventoryName: 'Display Area',
      lastRestocked: '2024-02-10',
      isActive: false
    },
    {
      id: '6',
      name: 'Gucci Bloom Eau de Parfum',
      stock: 20,
      price: 135.00,
      inventoryName: 'Main Storage',
      lastRestocked: '2024-02-17',
      isActive: true
    }
  ];
  
  filteredProducts: BranchProduct[] = [];
  searchTerm = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  
  ngOnInit() {
    this.filteredProducts = [...this.products];
  }

  applyFilter() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          product.inventoryName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || 
                          (this.statusFilter === 'active' && product.isActive) ||
                          (this.statusFilter === 'inactive' && !product.isActive);
      
      return matchesSearch && matchesStatus;
    });
  }

  onStatusFilterChange() {
    this.applyFilter();
  }
}
