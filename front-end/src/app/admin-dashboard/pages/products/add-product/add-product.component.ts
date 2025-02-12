import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../_services/product.service';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../../../_models/product.model';
import { ToastrService } from 'ngx-toastr';
import { UploadComponent } from 'src/app/upload/upload.component';
import { CategoryService } from 'src/app/_services/category.service';
import { Category } from 'src/app/_models/category.model';



@Component({
  selector: 'app-add-product',
  imports: [FormsModule,CommonModule,UploadComponent],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  categories: Category[] = [];
  @Input() show = false;
  @Input() productData: Product ={
    _id:'',
    name:'',
    price:0, 
    sellerId:{_id:'679bd316017427c66ece2617',firstName:'',lastName:''},
    categoryId:{_id:'',name:''},
    description:'', 
    prevPrice:0, 
    noOfSale:0, 
    images:[], 
    isActive:true, 
    quantity:0, 
    supplierId:'679bf428745c9d962586960e'
  };
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  loading = false;


  constructor(private productService: ProductService , private toastr: ToastrService,private categoryService:CategoryService) {}
  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategoriesActive().subscribe({
      next: (response) => {
        this.categories = response;
        console.log('✅ Categories loaded:', this.categories);
      },
      error: (error) => console.error('❌ Error fetching categories:', error)
    });
  }
  


  onImagesUploaded(imageUrls: string[]) {
    this.productData.images = imageUrls;
  }
  
  async onSubmit(): Promise<void> {
    try {
      this.loading = true;

      // Create product object
      const productData:Product = {
        _id:this.productData._id,
        name: this.productData.name.trim(),
        price: this.productData.price,
        sellerId: this.productData.sellerId||'679bd316017427c66ece2617',
        categoryId: this.productData.categoryId,
        description: this.productData.description?.trim() || '',
        prevPrice: this.productData.prevPrice,
        noOfSale: this.productData.noOfSale,
        images:this.productData.images,
        isActive: this.productData.isActive,
        quantity: this.productData.quantity,
        supplierId: this.productData.supplierId
      };

      await firstValueFrom(this.productService.createProduct(this.productData));
      this.toastr.success('Product added successfully!', 'Success');
      this.saved.emit();
      this.close.emit();
    } catch (error) {
      console.error('Error adding product:', error);
      this.toastr.error('Failed to add product. Please try again.', 'Error');
    } finally {
      this.loading = false;
    }
  }

  onClose(): void {
    this.close.emit();
  }

}
