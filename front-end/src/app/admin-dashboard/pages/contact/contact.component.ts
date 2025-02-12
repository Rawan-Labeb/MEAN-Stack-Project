import { Component } from '@angular/core';
import {Contact} from '../../../_models/contact.model'
import { ContactService } from '../../../_services/contact.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [CommonModule,MatIconModule,MatMenuModule,FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contacts: Contact[] = [
    {
      id:"1",
      fName: 'John',
      lName: 'Doe',
      email: 'johndoe@example.com',
      message: 'I have an issue with my order.',
      status: 'Pending'
    },
    {
      id:"2",
      fName: 'Jane',
      lName: 'Smith',
      email: 'janesmith@example.com',
      message: 'Can I get more details about the product?',
      status: 'Replied'
    },
    {
      id:"3",
      fName: 'Alice',
      lName: 'Brown',
      email: 'alicebrown@example.com',
      message: 'I want to change my delivery address.',
      status: 'Pending'
    }
  ];
;

  constructor(private contactService: ContactService) {}

  loadContacts() {
    this.contactService.getContacts().subscribe(
      (data: Contact[]) => {
        this.contacts = data;
      },
      error => {
        console.error('Error fetching contacts', error);
      }
    );
  }

  
      filteredContacts: Contact[] = [];
      loading = false;
      searchTerm: string = '';
      sortColumn: keyof Contact = 'fName';
      sortDirection: 'asc' | 'desc' = 'asc';
      statusFilter: 'all' |'Replied' | 'Pending' = 'all';
    
      ngOnInit(): void {
        this.filteredContacts = [...this.contacts];
    this.applyFilters();
      }
    
      loadUsers(): void {
        this.loading = true;
        this.contactService.getContacts().subscribe({
          next: (data: Contact[]) => {
            this.contacts = data;
            this.filteredContacts = [...data];
            this.applyFilters();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading Users:', error);
            this.loading = false;
          }
        });
      }
    
      deleteUser(id: string): void {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.contactService.deleteContact(id).subscribe({
              next: () => {
                this.loadUsers();
                Swal.fire('Deleted!', 'message has been deleted.', 'success');
              },
              error: (error) => {
                console.error('Error deleting message:', error);
                Swal.fire('Error!', 'Failed to delete message.', 'error');
              }
            });
          }
        });
      }
    
      applyFilters(): void {
        let filtered = [...this.contacts];
    
        if (this.searchTerm) {
          filtered = filtered.filter(user => 
            user.fName.toLowerCase().includes(this.searchTerm.toLowerCase()) 
          );
        }
    
        if (this.statusFilter !== 'all') {
          filtered = filtered.filter(order => 
            order.status === this.statusFilter 
          );
        }
    
        filtered.sort((a, b) => {
          const direction = this.sortDirection === 'asc' ? 1 : -1;
          // if (typeof a[this.sortColumn] === 'number') {
          //   return ((a[this.sortColumn] as number) - (b[this.sortColumn] as number)) * direction;
          // }
          return String(a[this.sortColumn]).localeCompare(String(b[this.sortColumn])) * direction;
        });
    
        this.filteredContacts = filtered;
      }
    
      onSearch(): void {
        this.applyFilters();
      }
    
      onStatusFilterChange(): void {
        this.applyFilters();
      }
    
      sort(column: keyof Contact): void {
        if (this.sortColumn === column) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = column;
          this.sortDirection = 'asc';
        }
        this.applyFilters();
      }
      markAsReplied(contact: any) {
        contact.status = 'Replied';  // Update the status
      }
      openEmail(email: string) {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
      }
}
