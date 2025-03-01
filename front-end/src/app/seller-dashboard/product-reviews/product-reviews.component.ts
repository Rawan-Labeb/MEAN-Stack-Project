import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductReviewService } from '../../_services/product-review.service';
import { AuthServiceService } from '../../_services/auth-service.service';
import { ProductService } from '../services/product.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.css']
})
export class ProductReviewsComponent implements OnInit {
  reviews: any[] = [];
  loading = false;

  constructor(
    private reviewService: ProductReviewService,
    private authService: AuthServiceService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      this.authService.decodeToken(token).subscribe({
        next: (decoded: any) => {
          if (decoded && decoded.id) {
            this.loadSellerReviews(decoded.id);
          }
        },
        error: (error: Error) => {
          console.error('Token decode error:', error);
          Swal.fire('Error', 'Authentication error', 'error');
        }
      });
    }
  }

  loadSellerReviews(sellerId: string) {
    this.loading = true;
    // First get all seller's products
    this.productService.getAllProducts().pipe(
      map(products => products.filter(p => p.sellerId === sellerId))
    ).subscribe({
      next: (products) => {
        // For each product, get its reviews
        const reviewObservables = products.map(product => 
          this.reviewService.getReviewsByProductId(product._id)
        );

        forkJoin(reviewObservables).subscribe({
          next: (reviewsArray) => {
            this.reviews = reviewsArray.flat();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading reviews:', error);
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }
}