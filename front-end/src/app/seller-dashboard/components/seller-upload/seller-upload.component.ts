import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerUploadService } from '../../services/seller-upload.service';

@Component({
  selector: 'app-seller-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-3">
      <label class="btn btn-primary" [class.disabled]="uploading">
        {{ uploading ? 'Uploading...' : 'Upload Images' }}
        <input type="file" 
               class="d-none" 
               multiple
               (change)="onFilesSelected($event)"
               [disabled]="uploading"
               accept="image/*">
      </label>

      <!-- Preview images -->
      <div class="preview-images mt-2 d-flex flex-wrap gap-2" *ngIf="previewUrls.length">
        <div *ngFor="let url of previewUrls" class="preview-image">
          <img [src]="url" 
               class="img-thumbnail" 
               style="width: 50px; height: 50px; object-fit: cover;">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .preview-image {
      position: relative;
      display: inline-block;
    }
    
    .img-thumbnail {
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class SellerUploadComponent {
  @Output() imagesUploaded = new EventEmitter<string[]>();
  
  previewUrls: string[] = [];
  uploading = false;

  constructor(private uploadService: SellerUploadService) {}

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.uploading = true;
      
      // Show previews immediately
      this.previewUrls = Array.from(files).map(file => URL.createObjectURL(file));
      
      this.uploadService.uploadProductImages(files).subscribe({
        next: (response) => {
          console.log('Upload response:', response);
          this.imagesUploaded.emit(response.imageUrls);
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.uploading = false;
        },
        complete: () => {
          console.log('Upload completed successfully');
          this.uploading = false;
        }
      });
    }
  }
} 