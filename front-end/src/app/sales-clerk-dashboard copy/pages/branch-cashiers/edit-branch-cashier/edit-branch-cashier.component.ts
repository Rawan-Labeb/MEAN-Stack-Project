import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CashierService, Cashier } from '../../../services/cashier.service';

@Component({
  selector: 'app-edit-branch-cashier',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal" [class.show]="show" [style.display]="show ? 'block' : 'none'" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Cashier</h5>
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
                  <input type="email" class="form-control" id="email" formControlName="email" [readonly]="true">
                </div>
                
                <div class="col-md-6">
                  <label for="contactNo" class="form-label">Contact Number</label>
                  <input type="tel" class="form-control" id="contactNo" formControlName="contactNo">
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
            <button type="button" class="btn btn-primary" [disabled]="loading" (click)="updateCashier()">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Update Cashier
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
export class EditBranchCashierComponent implements OnChanges {
  @Input() show = false;
  @Input() cashierData: Cashier | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();
  
  cashierForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  
  constructor(
    private fb: FormBuilder,
    private cashierService: CashierService
  ) {
    this.cashierForm = this.createForm();
  }
  
  ngOnChanges(): void {
    // When cashierData changes, update the form
    if (this.cashierData && this.show) {
      this.cashierForm.patchValue({
        firstName: this.cashierData.firstName,
        lastName: this.cashierData.lastName,
        email: this.cashierData.email,
        contactNo: this.cashierData.contactNo,
        isActive: this.cashierData.isActive
      });
    }
  }
  
  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      contactNo: [''],
      isActive: [true]
    });
  }
  
  get f() { return this.cashierForm.controls; }
  
  updateCashier(): void {
    this.submitted = true;
    this.errorMessage = '';
    
    if (this.cashierForm.invalid || !this.cashierData) {
      return;
    }
    
    this.loading = true;
    
    const updateData = {
      firstName: this.cashierForm.value.firstName,
      lastName: this.cashierForm.value.lastName,
      contactNo: this.cashierForm.value.contactNo,
      isActive: this.cashierForm.value.isActive
    };
    
    this.cashierService.updateCashier(this.cashierData._id, updateData).subscribe({
      next: () => {
        this.loading = false;
        this.updated.emit();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message;
      }
    });
  }
}