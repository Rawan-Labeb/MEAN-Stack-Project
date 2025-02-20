import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SubInventoryServicesService } from '../_services/sub-inventory.services.service';

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
  allPerfumes: Perfume[]= [
    { id: 1, name: 'Eternity', price: 79.99, image: '', category: 'men' },
    { id: 2, name: 'Ocean Breeze', price: 69.99, image: '', category: 'woman' },
    { id: 3, name: 'Midnight Bloom', price: 89.99, image: '', category: 'unisex' },
    { id: 4, name: 'Spring Essence', price: 59.99, image: '', category: 'men' },
    { id: 5, name: 'Night Mist', price: 99.99, image: '', category: 'woman' }
  ];
  // allPerfumes: Perfume[] = [];

  selectedCategory: string = '';
  sortBy: string = 'price-asc'; 
  itemsPerPage: number = 4; 
  currentPage: number = 1;

  get filteredPerfumes(): Perfume[] {
    return this.allPerfumes.filter((perfume) =>
      this.selectedCategory ? perfume.category === this.selectedCategory : true
    );
  }

  get sortedPerfumes(): Perfume[] {
    const perfumes = [...this.filteredPerfumes]; 

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
      .map((_, i) => i + 1);
  }
  // constructor(){}
  // ngOnInit():void{}

  constructor(
    public subInventorySer:SubInventoryServicesService
  ) {}
  

  productRelatedtoBarnch:any[] = [];
  test:any[] = [];
  prodDetails:any;
  loading: boolean = true; 


  // ngOnInit(): void {
  //   this.subInventorySer.getSubInventoryRelatedToBranch("Uptown Branch").subscribe({
  //     next: (data) => {
  //       this.productRelatedtoBarnch = data;
  //       this.test = this.productRelatedtoBarnch.map(prod => prod.product); // Extracting products
  //       console.log(this.test);
  //       console.log(this.productRelatedtoBarnch);
  //       // this.prodDetails = data;
  //     }
  //   });

  //   console.log(this.productRelatedtoBarnch);

  // }
  ngOnInit(): void {
    this.subInventorySer.getSubInventoryRelatedToBranch("Uptown Branch").subscribe({
      next: (data) => {
        this.productRelatedtoBarnch = data;
  
        this.test = this.productRelatedtoBarnch.map(prod => prod.product);
  
        this.allPerfumes = this.test as Perfume[];
  
        console.log('Fetched products:', this.allPerfumes);
        console.log('Raw API response:', this.productRelatedtoBarnch);
        console.log(this.productRelatedtoBarnch[1].product.name);
  
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false; 
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  updateSort(sortBy: string): void {
    this.sortBy = sortBy;
    this.currentPage = 1; 
  }

  updateCategory(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1; 
  }
}