import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { SubInventoryServicesService } from '../_services/sub-inventory.services.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthServiceService } from '../_services/auth-service.service';


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
export class HomeComponent implements OnInit{
  constructor(
    private router: Router,
    public subInventorySer: SubInventoryServicesService,
    public cookieServices:CookieService,
    public authSer: AuthServiceService,
  
    

  ) {}
  productRelatedtoBranch:any[]=[];
  ngOnInit(): void {
    this.subInventorySer.getSubInventoryRelatedToBranch("uptown branch").subscribe({
      next:(data)=>{
        this.productRelatedtoBranch=data;
        console.log(this.productRelatedtoBranch);
      }
    })
    
  
  }


  // Static perfume data
  perfumes: Perfume[] = [
    {
      id: 1,
      name: 'Eternity',
      price: 79.99,
      image: '',
      description: 'A timeless classic with floral and musk notes.',
      rating: 5


    },
    {
      id: 2,
      name: 'Ocean Breeze',
      price: 69.99,
      image: '',
      description: 'Fresh and invigorating with citrus and marine notes.',
      rating: 4
    },
    {
      id: 3,
      name: 'Midnight Bloom',
      price: 89.99,
      image: '',
      description: 'An enchanting blend of floral and woody scents.',
      rating: 3
    },
    {
      id: 3,
      name: 'Midnight Bloom',
      price: 89.99,
      image: '',
      description: 'An enchanting blend of floral and woody scents.',
      rating: 5
    }
  ];

   brands = [
    { name: 'Chanel', imgPath: 'assets/brands/channel.jpeg' },
    { name: 'Dior', imgPath: 'assets/brands/dior2.png' },
    { name: 'YSL', imgPath: 'assets/brands/ysl.jpeg' },
    { name: 'Tom Ford', imgPath: 'assets/brands/tomford.jpeg' },
    { name: 'Gucci', imgPath: 'assets/brands/gucci.jpeg' },
    { name: 'Versace', imgPath: 'assets/brands/vercase.jpeg' }
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
    { id: 1, name: 'Men', image: 'assets/category/men.jpeg' },
    { id: 2, name: 'Women', image: 'assets/category/women.jpeg' },
    { id: 3, name: 'Unnisex', image: 'assets/category/unisex.jpeg' }
  ];
  

  // Static new arrivals data
  newArrivals: Perfume[] = [
    {
      id: 4,
      name: 'Spring Essence',
      price: 59.99,
      image: '',
      description: 'A fresh and floral scent perfect for spring.',
      rating: 5
    },
    {
      id: 5,
      name: 'Night Mist',
      price: 99.99,
      image: '',
      description: 'A luxurious fragrance for evening wear.',
      rating: 5
    },
    {
      id: 5,
      name: 'Night Mist',
      price: 99.99,
      image: '',
      description: 'A luxurious fragrance for evening wear.',
      rating: 5
    },
    {
      id: 5,
      name: 'Night Mist',
      price: 99.99,
      image: '',
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
      image: 'assets/tips/choose.jpeg',
    },
    {
      id: 2,
      title: 'Top 5 Perfumes for Summer 2023',
      excerpt: 'Discover the best fragrances to keep you fresh this summer.',
      image: 'assets/tips/summer3.jpeg',
    }
  ];

  
  Array = Array;
  goBackToCatalog(): void {
    this.router.navigate(['/catalog']);
  }
  goBackToCategory(category:string): void {
    this.router.navigate(['/catalog'], { queryParams: { category } });
    }
  goBackToUserReg(): void {
    this.router.navigate(['/user/register']);
  }

  getToken(): string {
    return this.cookieServices.get('token'); 
  }

  decodeUserToken(token: string): any {
    try {
      const decoded = this.authSer.decodeToken(token);
      console.log('Decoded Token:', decoded); // Log the decoded token
      return decoded;
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }
}