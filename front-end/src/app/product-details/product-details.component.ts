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
  category: string;
  rating: number;
  reviews: Review[];
}

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  perfume: Perfume | null = null; // Current perfume details
  loading: boolean = true; // Loading state
  Array = Array;
  Math = Math;

  // User input fields
  userRating: number = 0; // Selected rating
  userComment: string = ''; // Comment text

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
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.perfume = this.perfumes.find((p) => p.id === productId) || null;

    // Simulate loading delay (optional)
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  // Set user rating when a star is clicked
  setRating(rating: number): void {
    this.userRating = rating;
  }

  // Submit the review
  submitReview(): void {
    if (!this.perfume) return;

    // Generate a new review object
    const newReview: Review = {
      id: this.perfume.reviews.length + 1, // Simple ID generation
      customerName: 'Anonymous', // Replace with actual user name if logged in
      rating: this.userRating,
      comment: this.userComment
    };

    // Add the review to the perfume's reviews array
    this.perfume.reviews.push(newReview);

    // Update the average rating
    const totalRatings = this.perfume.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.perfume.rating = totalRatings / this.perfume.reviews.length;

    // Reset form fields
    this.userRating = 0;
    this.userComment = '';

    // Alert success message
    alert('Thank you for your review!');
  }

  addToCart(): void {
    if (this.perfume) {
      alert(`"${this.perfume.name}" has been added to your cart!`);
    }
  }
}