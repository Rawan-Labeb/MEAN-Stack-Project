import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Perfume {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string; 
}

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  imports:[CommonModule,FormsModule,RouterLink],
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  allPerfumes: Perfume[] = [
    { id: 1, name: 'Eternity', price: 79.99, image: 'https://via.placeholder.com/300x300?text=Eternity', category: 'men' },
    { id: 2, name: 'Ocean Breeze', price: 69.99, image: 'https://via.placeholder.com/300x300?text=Ocean+Breeze', category: 'woman' },
    { id: 3, name: 'Midnight Bloom', price: 89.99, image: 'https://via.placeholder.com/300x300?text=Midnight+Bloom', category: 'unisex' },
    { id: 4, name: 'Spring Essence', price: 59.99, image: 'https://via.placeholder.com/300x300?text=Spring+Essence', category: 'men' },
    { id: 5, name: 'Night Mist', price: 99.99, image: 'https://via.placeholder.com/300x300?text=Night+Mist', category: 'woman' }
  ];

  selectedCategory: string = '';
  sortBy: string = 'price-asc'; // Default: Sort by price ascending
  itemsPerPage: number = 4; // Number of items per page
  currentPage: number = 1;

  // Computed properties
  get filteredPerfumes(): Perfume[] {
    return this.allPerfumes.filter((perfume) =>
      this.selectedCategory ? perfume.category === this.selectedCategory : true
    );
  }

  get sortedPerfumes(): Perfume[] {
    const perfumes = [...this.filteredPerfumes]; // Create a copy to avoid mutating the original array

    if (this.sortBy === 'price-asc') {
      return perfumes.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-desc') {
      return perfumes.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'name-asc') {
      return perfumes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortBy === 'name-desc') {
      return perfumes.sort((a, b) => b.name.localeCompare(a.name));
    }

    return perfumes;
  }

  get paginatedPerfumes(): Perfume[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.sortedPerfumes.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.sortedPerfumes.length / this.itemsPerPage);
  }

  // Generate an array for pagination
  get paginationArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1); // Generate [1, 2, 3, ..., totalPages]
  }

  constructor() {}

  ngOnInit(): void {}

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  updateSort(sortBy: string): void {
    this.sortBy = sortBy;
    this.currentPage = 1; // Reset pagination when sorting changes
  }

  updateCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1; // Reset pagination when filtering changes
  }
}