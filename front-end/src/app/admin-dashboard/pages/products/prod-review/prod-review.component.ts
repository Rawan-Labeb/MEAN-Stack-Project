import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import {ProductReviewService} from '../../../../_services/product-review.service'



@Component({
  selector: 'app-prod-review',
  imports: [FormsModule, CommonModule],
  templateUrl: './prod-review.component.html',
  styleUrl: './prod-review.component.css'
})
export class ProdReviewComponent {
  @Input() reviewData: any=[];
      @Input() show = false; 
      @Output() close = new EventEmitter<void>();
      onClose(): void {
        this.close.emit();
      }

      constructor(private productReviewService: ProductReviewService, private cdr: ChangeDetectorRef) {}

      deleteReview(id: string): void {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-secondary'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.productReviewService.deleteReviewById(id).subscribe({
              next: () => {
                // حذف العنصر من المصفوفة بعد نجاح الحذف
                this.reviewData = this.reviewData.filter((item: any) => item._id !== id);
                
                // تحديث الـ UI بعد التعديل
                this.cdr.detectChanges();
      
                Swal.fire({
                  title: 'Success!',
                  text: `Review has been deleted.`,
                  icon: 'success',
                  confirmButtonText: 'OK',
                  customClass: {
                    confirmButton: 'btn btn-success'
                  }
                });
              },
              error: (error) => {
                console.error('Error deleting review:', error);
                Swal.fire({
                  title: 'Error!',
                  text: error?.error?.message || 'Failed to delete review.',
                  icon: 'error',
                  confirmButtonText: 'OK',
                  customClass: {
                    confirmButton: 'btn btn-danger'
                  }
                });
              }
            });
          }
        });
      }
      
}
