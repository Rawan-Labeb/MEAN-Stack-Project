import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Perfume {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string; // Example categories: 'floral', 'citrus', 'oriental'
  rating: number; // Average rating (out of 5)
  reviews: Review[]; // Customer reviews
}

interface Review {
  id: number;
  customerName: string;
  rating: number; // Rating given by the customer
  comment: string; // Customer comment
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  imports:[CommonModule,FormsModule],
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  perfume: Perfume | null = null; // Current perfume details
  loading: boolean = true; // Loading state
  Array=Array
  Math=Math

  // Static perfume data (replace with API call in a real app)
  private perfumes: Perfume[] = [
    {
      id: 1,
      name: 'Eternity',
      price: 79.99,
      image: 'https://via.placeholder.com/300x300?text=Eternity',
      description: 'A timeless classic with floral and musk notes.',
      category: 'floral',
      rating: 4.5, // Average rating
      reviews: [
        { id: 1, customerName: 'John Doe', rating: 5, comment: 'Absolutely love this fragrance! It lasts all day.' },
        { id: 2, customerName: 'Jane Smith', rating: 4, comment: 'Great scent, but a bit too strong for summer.' }
      ]
    },
    {
      id: 2,
      name: 'Ocean Breeze',
      price: 69.99,
      image: 'https://via.placeholder.com/300x300?text=Ocean+Breeze',
      description: 'Fresh and invigorating with citrus and marine notes.',
      category: 'citrus',
      rating: 4.0,
      reviews: [
        { id: 1, customerName: 'Alice Johnson', rating: 4, comment: 'Perfect for summer days!' },
        { id: 2, customerName: 'Bob Brown', rating: 3, comment: 'Nice, but not my favorite.' }
      ]
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the product ID from the route parameter
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    // Find the perfume by ID

    // this.perfume = this.perfumes.find((p) => p.id === productId) || null;
    this.perfume = this.perfumes[1];

    // Simulate loading delay (optional)
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  addToCart(): void {
    if (this.perfume) {
      alert(`"${this.perfume.name}" has been added to your cart!`);
      // Implement actual cart logic here
    }
  }
}