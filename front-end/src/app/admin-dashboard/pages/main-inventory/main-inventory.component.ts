import { Component, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { MainInventory } from '../../../_models/main-inventory.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MainInventoryService } from '../../../_services/main-inventory.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddMainInventoryComponent } from './add-main-inventory/add-main-inventory.component';
import { EditMainInventoryComponent } from './edit-main-inventory/edit-main-inventory.component';

@Component({
  selector: 'app-main-inventory',
  imports: [CommonModule,FormsModule,RouterModule,MatIconModule,MatMenuModule,AddMainInventoryComponent,EditMainInventoryComponent],
  templateUrl: './main-inventory.component.html',
  styleUrl: './main-inventory.component.css'
})
export class MainInventoryComponent implements OnInit, OnDestroy{
  mainInventories: MainInventory[] =[]
      filteredMainInventories: MainInventory[] = [];
      loading = false;
      searchTerm: string = '';
      sortColumn: keyof MainInventory = 'product';
      sortDirection: 'asc' | 'desc' = 'asc';
      showAddModal = false;
      showEditModal = false;
      editingMainInventory?: MainInventory;
      selectedFiles: File[] = [];
      error: string | null = null;
      private destroy$ = new Subject<void>();
      mainInventoryData: MainInventory = this.getInitialMainInventoryData();
      constructor(private mainInventoryService: MainInventoryService , private cdr: ChangeDetectorRef) {}
    
      ngOnInit(): void {
        this.loadMainInventories();
        this.subscribeToMainInventoryUpdates();
      }
      getInitialMainInventoryData(): MainInventory {
        return {
          _id: '',
          product: {_id:'',name:'',price:0,prevPrice:0,images:[],noOfSale:0,sellerId:{_id:'',firstName:'',lastName:''},categoryId:{_id:'',name:''}},
          distributed:0,
          quantity:0,
          lastUpdated:new Date(),
        };
      }

      subscribeToMainInventoryUpdates(): void {
        this.mainInventoryService.onMainInventoryUpdate()
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.loadMainInventories());
      }
  
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }
  
    
      async loadMainInventories(): Promise<void> {
        this.loading = true;
        this.error = null;
        
        try {
          const data = await firstValueFrom(this.mainInventoryService.getAllMainInventory());
          this.mainInventories = [...data]
          this.filteredMainInventories = [...this.mainInventories];
      
          this.applyFilters();
          this.cdr.detectChanges();
        } catch (error) {
          console.error('❌ Error loading MainInventories:', error);
          this.error = 'Failed to load MainInventorxies';
        } finally {
          this.loading = false;
          this.cdr.detectChanges();
        }
      }
    
      deleteMainInventory(id: string): void {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.mainInventoryService.deleteMainInventory(id).subscribe({
              next: () => {
                this.loadMainInventories();
                Swal.fire('Deleted!', 'MainInventory has been deleted.', 'success');
              },
              error: (error) => {
                console.error('Error deleting MainInventory:', error);
                Swal.fire('Error!', 'Failed to delete MainInventory.', 'error');
              }
            });
          }
        });
      }

      applyFilters(): void {
        let filtered = [...this.mainInventories];
    
        if (this.searchTerm) {
          const searchLower = this.searchTerm.toLowerCase();
          filtered = filtered.filter(mainInventory => 
            mainInventory.product.name.toLowerCase().includes(searchLower) 
          );
        }
    
        filtered.sort((a, b) => {
          const direction = this.sortDirection === 'asc' ? 1 : -1;
          return String(a[this.sortColumn]).localeCompare(String(b[this.sortColumn])) * direction;
        });
    
        this.filteredMainInventories = [...filtered];
        this.cdr.detectChanges();
      }
    
      onSearch(): void {
        this.applyFilters();
      }
    
      onStatusFilterChange(): void {
        this.applyFilters();
      }
    
      sort(column: keyof MainInventory): void {
        if (this.sortColumn === column) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = column;
          this.sortDirection = 'asc';
        }
        this.applyFilters();
      }
      
        openAddModal(): void {
          this.mainInventoryData = this.getInitialMainInventoryData();
          this.showAddModal = true;
        }
      
        openEditModal(mainInventory: MainInventory): void {
          this.editingMainInventory = mainInventory;
          this.mainInventoryData = { ...mainInventory };
          this.showEditModal = true;
        }
      
        onMainInventorySaved(): void {
          this.loadMainInventories();
          this.showAddModal = false;
        }
      
        onMainInventoryUpdated(): void {
          this.showEditModal = false;
          this.loadMainInventories();
        }
}
