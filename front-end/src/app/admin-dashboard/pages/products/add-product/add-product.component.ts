import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../_services/product.service';
import { UploadService } from '../../../../_services/upload.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule,CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  products: any[] = [];
    selectedFile: File | null = null;
    selectedProductId: string = '';
  
    constructor(private productService: ProductService, private uploadService: UploadService) {}
  
    ngOnInit(): void {
      this.fetchProducts();
    }
  
    fetchProducts(): void {
      this.productService.getAllProducts().subscribe(
        (response: any[]) => { 
          console.log(response)
          this.products = response;
        },
        (error) => {
          console.error("Error fetching products:", error);
        }
      );
    }
  
    onFileChange(event: any, productId: string): void {
      this.selectedFile = event.target.files[0];
      this.selectedProductId = productId;
    }
  
    uploadImage(): void {
      if (this.selectedFile && this.selectedProductId) {
        this.uploadService.uploadImage(this.selectedFile, 'product', this.selectedProductId).subscribe(
          (response) => {
            this.fetchProducts(); // ✅ Update the product list after upload
          },
          (error) => {
            console.error('Error uploading file:', error);
          }
        );
      }
    }
}
