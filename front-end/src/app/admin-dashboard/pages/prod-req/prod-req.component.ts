import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { ProdReq } from '../../../_models/prod-request.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProdReqService } from '../../../_services/prod-req.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-prod-req',
  imports: [CommonModule,FormsModule,RouterModule,MatIconModule,MatMenuModule,NgxPaginationModule],
  templateUrl: './prod-req.component.html',
  styleUrl: './prod-req.component.css'
})
export class ProdReqComponent implements OnInit, OnDestroy{
  currentPage = 1;
    itemsPerPage = 10;
    prodReqs: ProdReq[] =[]
        filteredProdReqs: ProdReq[] = [];
        loading = false;
        searchTerm: string = '';
        sortColumn: keyof ProdReq = 'createdAt';
        sortDirection: 'asc' | 'desc' = 'asc';
        statusFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'all';
        showAddModal = false;
        showEditModal = false;
        editingProdReq?: ProdReq;
        selectedFiles: File[] = [];
        error: string | null = null;
        private destroy$ = new Subject<void>();
        prodReqData: ProdReq = this.getInitialProdReqData();
        constructor(private prodReqService: ProdReqService , private cdr: ChangeDetectorRef
        ) {}
      
        ngOnInit(): void {
          this.loadProdReqs();
          this.subscribeToProdReqUpdates();
        }
        getInitialProdReqData(): ProdReq {
          return {
              _id: '',
              product: {_id:'',name:'',images:[]},
              seller: {_id:'',firstName: '',lastName: '',email: ''},
              superAdmin: '',
              requestedQuantity: 0,
              status: 'pending' ,
              message: '',
              createdAt: '',
              updatedAt: '',
          }
          };
        subscribeToProdReqUpdates(): void {
          this.prodReqService.onProdReqUpdate()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.loadProdReqs());
        }
    
        ngOnDestroy(): void {
          this.destroy$.next();
          this.destroy$.complete();
        }
    
      
        async loadProdReqs(): Promise<void> {
          this.loading = true;
          this.error = null;
          
          try {
            const data = await firstValueFrom(this.prodReqService.getAllProdReqs());
            this.prodReqs = [...data]
        
            this.filteredProdReqs = [...this.prodReqs];
            
            this.applyFilters();
            this.cdr.detectChanges();
          } catch (error) {
            console.error('❌ Error loading ProdReqs:', error);
            this.error = 'Failed to load ProdReqs';
          } finally {
            this.loading = false;
            this.cdr.detectChanges();
          }
        }
        
    
        get pendingProdReqCount(): number {
          return this.prodReqs.filter(prodReq => prodReq.status === 'pending').length;
        }
        get approveProdReqCount(): number {
          return this.prodReqs.filter(prodReq => prodReq.status === 'approved').length;
        }
        get rejectProdReqCount(): number {
          return this.prodReqs.filter(prodReq => prodReq.status === 'rejected').length;
        }
      
      
        deleteProdReq(id: string): void {
          Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            customClass: {
              confirmButton: 'btn btn-primary',
              cancelButton:'btn btn-secondary'  
            }
          }).then((result) => {
            if (result.isConfirmed) {
              this.prodReqService.deleteProdReq(id).subscribe({
                next: () => {
                  this.loadProdReqs();
                  Swal.fire({
                    title: 'Success!',
                    text: `ProdReq has been deleted.`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    customClass: {
                      confirmButton: 'btn btn-success'  
                    }
                  });
                },
                error: (error) => {
                  console.error('Error deleting ProdReq:', error);
                  Swal.fire({
                    title: 'Error!',
                    text: error?.error?.message || 'Failed to delete ProdReq.',
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
    
        applyFilters(): void {
          let filtered = [...this.prodReqs];
      
          if (this.searchTerm) {
            const searchLower = this.searchTerm.toLowerCase();
            filtered = filtered.filter(prodReq => 
              prodReq.seller.firstName.toLowerCase().includes(searchLower) 
            );
          }
      
          if (this.statusFilter !== 'all') {
            filtered = filtered.filter(prodReq => 
              prodReq.status === this.statusFilter
            );
          }
      
          filtered.sort((a, b) => {
            const direction = this.sortDirection === 'asc' ? 1 : -1;
            return String(a[this.sortColumn]).localeCompare(String(b[this.sortColumn])) * direction;
          });
      
          this.filteredProdReqs = [...filtered];
          this.cdr.detectChanges();
        }
      
        onSearch(): void {
          this.applyFilters();
        }
      
        onStatusFilterChange(): void {
          this.applyFilters();
        }
      
        sort(column: keyof ProdReq): void {
          if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
          } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
          }
          this.applyFilters();
        }
        
          // openAddModal(): void {
          //   this.userData = this.getInitialUserData();
          //   this.showAddModal = true;
          // }
        
          // openEditModal(user: User): void {
          //   this.editingUser = user;
          //   this.userData = { ...user };
          //   this.showEditModal = true;
          //   console.log("✅ Opening Edit Modal with Data:", this.userData);
          // }
        
          // onUserSaved(): void {
          //   this.loadUsers();
          //   this.showAddModal = false;
          // }
        
          // onUserUpdated(): void {
          //   this.showEditModal = false;
          //   this.loadUsers();
          // }
}
