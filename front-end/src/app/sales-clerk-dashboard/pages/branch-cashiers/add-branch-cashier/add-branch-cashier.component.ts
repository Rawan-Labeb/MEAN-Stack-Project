import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CashierService } from '../../../services/cashier.service';
import { AuthServiceService } from '../../../../_services/auth-service.service';

@Component({
  selector: 'app-add-branch-cashier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal" [class.show]="show" [style.display]="show ? 'block' : 'none'" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New Cashier</h5>
            <button type="button" class="btn-close" (click)="close.emit()"></button>
          </div>
          <div class="modal-body">
            <div *ngIf="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            
            <form [formGroup]="cashierForm">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="firstName" class="form-label">First Name</label>
                  <input type="text" class="form-control" id="firstName" formControlName="firstName">
                  <div *ngIf="submitted && f['firstName'].errors" class="text-danger">
                    <span *ngIf="f['firstName'].errors['required']">First name is required</span>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <label for="lastName" class="form-label">Last Name</label>
                  <input type="text" class="form-control" id="lastName" formControlName="lastName">
                  <div *ngIf="submitted && f['lastName'].errors" class="text-danger">
                    <span *ngIf="f['lastName'].errors['required']">Last name is required</span>
                  </div>
                </div>
              </div>
              
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" formControlName="email">
                  <div *ngIf="submitted && f['email'].errors" class="text-danger">
                    <span *ngIf="f['email'].errors['required']">Email is required</span>
                    <span *ngIf="f['email'].errors['email']">Email is invalid</span>
                  </div>
                </div>
                
                <div class="col-md-6">
                  <label for="contactNo" class="form-label">Contact Number</label>
                  <input type="tel" class="form-control" id="contactNo" formControlName="contactNo">
                </div>
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" formControlName="password">
                <div *ngIf="submitted && f['password'].errors" class="text-danger">
                  <span *ngIf="f['password'].errors['required']">Password is required</span>
                  <span *ngIf="f['password'].errors['pattern']">
                    Password must contain at least 8 characters, including uppercase, lowercase, 
                    a number and a special character
                  </span>
                </div>
              </div>
              
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="isActive" formControlName="isActive">
                <label class="form-check-label" for="isActive">
                  Active Account
                </label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="close.emit()">Cancel</button>
            <button type="button" class="btn btn-primary" [disabled]="loading" (click)="saveCashier()">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Save Cashier
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" *ngIf="show"></div>
  `,
  styles: [`
    .modal-backdrop { opacity: 0.5; }
  `]
})
export class AddBranchCashierComponent {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();
  
  cashierForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  branchId: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private cashierService: CashierService,
    private authService: AuthServiceService
  ) {
    this.cashierForm = this.createForm();
    this.getBranchId();
  }
  
  getBranchId(): void {
    const token = this.authService.getToken();
    if (token) {
      this.authService.decodeToken(token).subscribe({
        next: (decoded) => {
          if (decoded) {
            this.branchId = decoded.branchId;
            this.cashierForm.patchValue({ branch: this.branchId });
          }
        }
      });
    }
  }
  
  createForm(): FormGroup {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(passwordRegex)]],
      contactNo: [''],
      isActive: [true],
      branch: [null],
      role: ['cashier']
    });
  }
  
  get f() { return this.cashierForm.controls; }
  
  saveCashier(): void {
    this.submitted = true;
    this.errorMessage = '';
    
    if (this.cashierForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    // Make sure the branch ID is set
    if (this.branchId) {
      this.cashierForm.patchValue({ branch: this.branchId });
    }
    
    this.cashierService.addCashier(this.cashierForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.saved.emit(response);
        this.cashierForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message;
      }
    });
  }
}