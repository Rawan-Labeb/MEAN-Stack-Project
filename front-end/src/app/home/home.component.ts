import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Perfume {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;

}

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
}

interface Category {
  id: number;
  name: string;
  image: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports:[CommonModule,RouterLink],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Static perfume data
  perfumes: Perfume[] = [
    {
      id: 1,
      name: 'Eternity',
      price: 79.99,
      image: 'https://via.placeholder.com/300x300?text=Eternity',
      description: 'A timeless classic with floral and musk notes.',
      rating: 5


    },
    {
      id: 2,
      name: 'Ocean Breeze',
      price: 69.99,
      image: 'https://via.placeholder.com/300x300?text=Ocean+Breeze',
      description: 'Fresh and invigorating with citrus and marine notes.',
      rating: 4
    },
    {
      id: 3,
      name: 'Midnight Bloom',
      price: 89.99,
      image: 'https://via.placeholder.com/300x300?text=Midnight+Bloom',
      description: 'An enchanting blend of floral and woody scents.',
      rating: 3
    },
    {
      id: 3,
      name: 'Midnight Bloom',
      price: 89.99,
      image: 'https://via.placeholder.com/300x300?text=Midnight+Bloom',
      description: 'An enchanting blend of floral and woody scents.',
      rating: 5
    }
  ];

  // Static review data
  reviews: Review[] = [
    {
      id: 1,
      customerName: 'John Doe',
      rating: 5,
      comment: 'Absolutely love this fragrance! It lasts all day.'
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      rating: 4,
      comment: 'Great scent, but a bit too strong for summer.'
    },
    {
      id: 3,
      customerName: 'Jane Doe',
      rating: 3,
      comment: 'good scent.'
    }
  ];

  // Static category data
  categories: Category[] = [
    { id: 1, name: 'Floral', image: 'https://via.placeholder.com/300x200?text=Floral' },
    { id: 2, name: 'Oriental', image: 'https://via.placeholder.com/300x200?text=Oriental' },
    { id: 3, name: 'Citrus', image: 'https://via.placeholder.com/300x200?text=Citrus' }
  ];

  // Static new arrivals data
  newArrivals: Perfume[] = [
    {
      id: 4,
      name: 'Spring Essence',
      price: 59.99,
      image: 'https://via.placeholder.com/300x300?text=Spring+Essence',
      description: 'A fresh and floral scent perfect for spring.',
      rating: 5
    },
    {
      id: 5,
      name: 'Night Mist',
      price: 99.99,
      image: 'https://via.placeholder.com/300x300?text=Night+Mist',
      description: 'A luxurious fragrance for evening wear.',
      rating: 5
    },
    {
      id: 5,
      name: 'Night Mist',
      price: 99.99,
      image: 'https://via.placeholder.com/300x300?text=Night+Mist',
      description: 'A luxurious fragrance for evening wear.',
      rating: 5
    },
    {
      id: 5,
      name: 'Night Mist',
      price: 99.99,
      image: 'https://via.placeholder.com/300x300?text=Night+Mist',
      description: 'A luxurious fragrance for evening wear.',
      rating: 5
    }
  ];

  // Static blog post data
  blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'The Art of Choosing the Right Fragrance',
      excerpt: 'Learn how to select a perfume that matches your personality and occasion.',
      image: 'https://via.placeholder.com/300x200?text=Fragrance+Tips'
    },
    {
      id: 2,
      title: 'Top 5 Perfumes for Summer 2023',
      excerpt: 'Discover the best fragrances to keep you fresh this summer.',
      image: 'https://via.placeholder.com/300x200?text=Summer+Perfumes'
    }
  ];

  // Expose the global Array object as a property
  Array = Array;
}