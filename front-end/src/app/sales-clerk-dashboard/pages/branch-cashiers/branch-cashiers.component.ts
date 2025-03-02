import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AddBranchCashierComponent } from './add-branch-cashier/add-branch-cashier.component';
import { EditBranchCashierComponent } from './edit-branch-cashier/edit-branch-cashier.component';

// Model for cashier users
interface Cashier {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  branch: {
    _id: string;
    branchName: string;
  };
  contactNo: string;
  image: string;
  isActive: boolean;
  role: string;
}

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
  // Static data for demonstration
  cashiers: Cashier[] = [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      branch: { _id: 'b1', branchName: 'Downtown Branch' },
      contactNo: '555-1234',
      image: 'assets/images/avatars/avatar1.jpg',
      isActive: true,
      role: 'cashier'
    },
    {
      _id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@example.com',
      branch: { _id: 'b1', branchName: 'Downtown Branch' },
      contactNo: '555-5678',
      image: 'assets/images/avatars/avatar2.jpg',
      isActive: true,
      role: 'cashier'
    },
    {
      _id: '3',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.b@example.com',
      branch: { _id: 'b1', branchName: 'Downtown Branch' },
      contactNo: '555-9012',
      image: 'assets/images/avatars/avatar3.jpg',
      isActive: false,
      role: 'cashier'
    },
    {
      _id: '4',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.d@example.com',
      branch: { _id: 'b1', branchName: 'Downtown Branch' },
      contactNo: '555-3456',
      image: 'assets/images/avatars/avatar4.jpg',
      isActive: true,
      role: 'cashier'
    }
  ];

  filteredCashiers: Cashier[] = [];
  loading = false;
  searchTerm: string = '';
  sortColumn: keyof Cashier = 'firstName';
  sortDirection: 'asc' | 'desc' = 'asc';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  showAddModal = false;
  showEditModal = false;
  selectedCashier: Cashier | null = null;
  
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Initialize with all cashiers
    this.filteredCashiers = [...this.cashiers];
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
        this.cashiers = this.cashiers.filter(c => c._id !== id);
        this.filteredCashiers = this.filteredCashiers.filter(c => c._id !== id);
        Swal.fire('Deleted!', 'Cashier has been deleted.', 'success');
      }
    });
  }

  toggleCashierStatus(cashier: Cashier): void {
    cashier.isActive = !cashier.isActive;
    this.applyFilters();
    
    const status = cashier.isActive ? 'activated' : 'deactivated';
    Swal.fire({
      title: 'Status Updated',
      text: `Cashier has been ${status}`,
      icon: 'success',
      timer: 1500
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

  onCashierSaved(): void {
    this.showAddModal = false;
    // In a real app, this would refresh the cashier list
    Swal.fire('Success', 'Cashier added successfully', 'success');
  }

  onCashierUpdated(): void {
    this.showEditModal = false;
    // In a real app, this would refresh the cashier list
    Swal.fire('Success', 'Cashier updated successfully', 'success');
  }
}