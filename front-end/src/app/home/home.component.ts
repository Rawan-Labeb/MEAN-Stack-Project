import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { SubInventoryService } from '../_services/sub-inventory.service';
import { CategoryService } from '../_services/category.service';
import { AuthServiceService } from '../_services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';


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
export class HomeComponent implements OnInit
{
  constructor(
    private router: Router,
    private subInventorySer:SubInventoryService,
    private categorySer:CategoryService,
    private authSer:AuthServiceService,
    private cookieServices:CookieService
  ) {}

  productRelatedtoBarnch:any[] = [];
  products:any[] = [];
  prodDetails:any;
  loading: boolean = true; 
  token:any = null;

  getToken(): string {
    return this.cookieServices.get('token'); 
  }


  // ngOnInit(): void {
  //   this.authSer.decodeToken(this.getToken()).subscribe({
  //     next: (data) => {
  //       this.token = data;
  //       this.fetchProducts();
  //       console.log(this.products)
  //     },
  //     error: (err) => {
  //       console.error('Error fetching token:', err);
  //       // this.loading = false;
  //     }
  //   });

  // }
  
  // private fetchProducts(): void {
  //   const branchId = this.authSer.isAuthenticated() && this.token.branchId
  //     ? this.token.branchId
  //     : '67b129216e1b912065196f93';
  
  //   this.subInventorySer.getActiveSubInventoriesByBranchId(branchId).subscribe({
  //     next: (data) => {
  //       console.log(data);
  //       this.productRelatedtoBarnch = data;
        
  //       const categoryRequests = this.productRelatedtoBarnch.map(prod =>
  //         this.categorySer.getCategoryById(prod.product.categoryId).toPromise()
  //       );
  
  //       Promise.all(categoryRequests).then(categories => {
  //         this.products = this.productRelatedtoBarnch.map((prod, index) => ({
  //           productName: prod.product.name,
  //           productPrice: prod.product.price,
  //           productDescription: prod.product.description,
  //           productImage: prod.product.images,
  //           productCategory: categories[index]?.name,
  //           productQuantity: prod.quantity,
  //           noOfSale: prod.numberOfSales,
  //           subInventoryDate: prod.lastUpdated,
  //           _id: prod._id
  //         }));
  //         console.log(this.products); 
  //         this.loading = false;
  //       }).catch(error => {
  //         console.error('Failed to retrieve categories', error);
  //       });
        

  //     },
  //     error: (err) => {
  //       console.error('Error fetching products:', err);
  //       this.loading = false; 
  //     }
  //   });
  // }
  

  // async ngOnInit(): Promise<void> {
  //   try {
  //     this.token = await this.authSer.decodeToken(this.getToken()).toPromise();
  //     await this.fetchProducts();
  //     console.log(this.products); // ✅ Now logs the updated products array
  //   } catch (err) {
  //     console.error('Error fetching token:', err);
  //   }
  // }


  // ngOnInit(): void {
  //   this.authSer.decodeToken(this.getToken()).subscribe({
  //     next: (data) => {
  //       this.token = data;

  //     },
  //     error: (err) => {
  //       console.error('Error fetching token:', err);
  //       // this.loading = false;
  //     }
  //   });

  //   const branchId = this.authSer.isAuthenticated() && this.token.branchId
  //     ? this.token.branchId
  //     : '67b129216e1b912065196f93';
  
  //   this.subInventorySer.getActiveSubInventoriesByBranchId(branchId).subscribe({
  //     next: (data) => {
  //       console.log(data);
  //       this.productRelatedtoBarnch = data;
        
  //       const categoryRequests = this.productRelatedtoBarnch.map(prod =>
  //         this.categorySer.getCategoryById(prod.product.categoryId).toPromise()
  //       );
  
  //       Promise.all(categoryRequests).then(categories => {
  //         this.products = this.productRelatedtoBarnch.map((prod, index) => ({
  //           productName: prod.product.name,
  //           productPrice: prod.product.price,
  //           productDescription: prod.product.description,
  //           productImage: prod.product.images,
  //           productCategory: categories[index]?.name,
  //           productQuantity: prod.quantity,
  //           noOfSale: prod.numberOfSales,
  //           subInventoryDate: prod.lastUpdated,
  //           _id: prod._id
  //         }));
  //         console.log(this.products); 
  //         this.loading = false;
  //       }).catch(error => {
  //         console.error('Failed to retrieve categories', error);
  //       });
        

  //     },
  //     error: (err) => {
  //       console.error('Error fetching products:', err);
  //       this.loading = false; 
  //     }
  //   });

  //   console.log(this.products)
  // }


  
  // private async fetchProducts(): Promise<void> {
  //   try {
  //     const branchId = this.authSer.isAuthenticated() && this.token.branchId
  //       ? this.token.branchId
  //       : '67b129216e1b912065196f93';
  
  //     await this.subInventorySer.getActiveSubInventoriesByBranchId(branchId).subscribe({
  //       next: (data) => {
  //         console.log(data);
  //         this.productRelatedtoBarnch = data;
  //       }
  //     });
  
  //     const categoryRequests = this.productRelatedtoBarnch.map(prod =>
  //       this.categorySer.getCategoryById(prod.product.categoryId).toPromise()
  //     );
  
  //     const categories = await Promise.all(categoryRequests);
  
  //     this.products = this.productRelatedtoBarnch.map((prod, index) => ({
  //       productName: prod.product.name,
  //       productPrice: prod.product.price,
  //       productDescription: prod.product.description,
  //       productImage: prod.product.images,
  //       productCategory: categories[index]?.name,
  //       productQuantity: prod.quantity,
  //       noOfSale: prod.numberOfSales,
  //       subInventoryDate: prod.lastUpdated,
  //       _id: prod._id
  //     }));
  
  //     console.log(this.products); // ✅ Now logs the updated products array
  //     this.loading = false;
  //   } catch (error) {
  //     console.error('Failed to retrieve products or categories', error);
  //     this.loading = false;
  //   }
  // }


  async ngOnInit(): Promise<void> {
    try {
      this.token = await this.authSer.decodeToken(this.getToken()).toPromise();
      await this.fetchProducts();
      console.log(this.products); 
    } catch (err) {
      console.error('Error fetching token:', err);
    }
  }
  
  private async fetchProducts(): Promise<void> {
    try {
      const branchId = this.authSer.isAuthenticated() && this.token.branchId
        ? this.token.branchId
        : '67b129216e1b912065196f93';
  
      this.productRelatedtoBarnch = await this.subInventorySer.getActiveSubInventoriesByBranchId(branchId).toPromise() ?? [];
  
      const categoryRequests = this.productRelatedtoBarnch.map(prod =>
        this.categorySer.getCategoryById(prod.product.categoryId).toPromise()
      );
  
      const categories = await Promise.all(categoryRequests);
  
      this.products = this.productRelatedtoBarnch.map((prod, index) => ({
        productName: prod.product.name,
        productPrice: prod.product.price,
        productDescription: prod.product.description,
        productImage: prod.product.images,
        productCategory: categories[index]?.name,
        productQuantity: prod.quantity,
        noOfSale: prod.numberOfSales,
        subInventoryDate: prod.lastUpdated,
        _id: prod._id
      }));
  
      console.log(this.products); 
      this.loading = false;
    } catch (error) {
      console.error('Failed to retrieve products or categories', error);
      this.loading = false;
    }
  }
  


  



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
    { id: 1, name: 'Men', image: 'https://via.placeholder.com/300x200?text=Floral' },
    { id: 2, name: 'Woman', image: 'https://via.placeholder.com/300x200?text=Oriental' },
    { id: 3, name: 'Unnisex', image: 'https://via.placeholder.com/300x200?text=Citrus' }
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

  
  Array = Array;
  goBackToCatalog(): void {
    this.router.navigate(['/catalog']);
  }
}