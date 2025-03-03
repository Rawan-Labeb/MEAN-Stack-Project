import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AddBranchCashierComponent } from './add-branch-cashier/add-branch-cashier.component';
import { EditBranchCashierComponent } from './edit-branch-cashier/edit-branch-cashier.component';
import { CashierService, Cashier } from '../../services/cashier.service';
import { AuthServiceService } from '../../../_services/auth-service.service';

@Component({
  selector: 'app-branch-cashiers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AddBranchCashierComponent,
    EditBranchCashierComponent
  ],
  templateUrl: './branch-cashiers.component.html',
  styleUrls: ['./branch-cashiers.component.css']
})
export class BranchCashiersComponent implements OnInit {
  // Data
  cashiers: Cashier[] = [];
  filteredCashiers: Cashier[] = [];
  
  // UI State
  loading = false;
  errorMessage = '';
  searchTerm: string = '';
  sortColumn: keyof Cashier = 'firstName';
  sortDirection: 'asc' | 'desc' = 'asc';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  showAddModal = false;
  showEditModal = false;
  selectedCashier: Cashier | null = null;
  
  // User Info
  branchId: string | null = null;
  clerkRole: string = '';
  
  constructor(
    private cashierService: CashierService,
    private authService: AuthServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'Authentication required. Please log in.';
      return;
    }
    
    this.authService.decodeToken(token).subscribe({
      next: (decoded) => {
        if (decoded) {
          this.branchId = decoded.branchId || null;
          this.clerkRole = decoded.role || '';
          this.loadCashiers();
        } else {
          this.errorMessage = 'Invalid user session. Please log in again.';
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to decode authentication token.';
        console.error('Token decode error:', err);
      }
    });
  }

  loadCashiers(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.cashierService.getCashiers(this.branchId || '').subscribe({
      next: (data) => {
        this.cashiers = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = `Failed to load cashiers: ${err.message}`;
        console.error('Error loading cashiers:', err);
      }
    });
  }

  get activeCashiersCount(): number {
    return this.cashiers.filter(cashier => cashier.isActive === true).length;
  }

  get inactiveCashiersCount(): number {
    return this.cashiers.filter(cashier => cashier.isActive === false).length;
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  openEditModal(cashier: Cashier): void {
    this.selectedCashier = cashier;
    this.showEditModal = true;
    console.log("✅ Opening Edit Modal with Data:", cashier);
  }

  deleteCashier(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        
        this.cashierService.deleteCashier(id).subscribe({
          next: () => {
            this.cashiers = this.cashiers.filter(c => c._id !== id);
            this.applyFilters();
            this.loading = false;
            Swal.fire('Deleted!', 'Cashier has been deleted.', 'success');
          },
          error: (err) => {
            this.loading = false;
            Swal.fire('Error!', `Failed to delete cashier: ${err.message}`, 'error');
          }
        });
      }
    });
  }

  toggleCashierStatus(cashier: Cashier): void {
    const newStatus = !cashier.isActive;
    this.loading = true;
    
    this.cashierService.toggleCashierStatus(cashier._id, newStatus).subscribe({
      next: (updatedCashier) => {
        cashier.isActive = newStatus;
        this.applyFilters();
        this.loading = false;
        
        const status = newStatus ? 'activated' : 'deactivated';
        Swal.fire({
          title: 'Status Updated',
          text: `Cashier has been ${status}`,
          icon: 'success',
          timer: 1500
        });
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error!', `Failed to update cashier status: ${err.message}`, 'error');
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.cashiers];

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(cashier => 
        cashier.firstName.toLowerCase().includes(searchLower) ||
        cashier.lastName.toLowerCase().includes(searchLower) ||
        cashier.email.toLowerCase().includes(searchLower)
      );
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(cashier => 
        cashier.isActive === (this.statusFilter === 'active')
      );
    }

    filtered.sort((a, b) => {
      const direction = this.sortDirection === 'asc' ? 1 : -1;
      return String(a[this.sortColumn]).localeCompare(String(b[this.sortColumn])) * direction;
    });

    this.filteredCashiers = [...filtered];
    this.cdr.detectChanges();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  sort(column: keyof Cashier): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  onCashierSaved(newCashier: any = null): void {
    this.showAddModal = false;
    this.loadCashiers();  // Refresh the list to include the new cashier
    Swal.fire('Success', 'Cashier added successfully', 'success');
  }

  onCashierUpdated(): void {
    this.showEditModal = false;
    this.loadCashiers();  // Refresh the list to get the updated data
    Swal.fire('Success', 'Cashier updated successfully', 'success');
  }
}