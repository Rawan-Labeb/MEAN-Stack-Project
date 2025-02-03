import { Component } from '@angular/core';
import { User } from '../../../_models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [CommonModule,FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: User[] = [
    { name: 'Talia Keyes', email: 'tkeyes@example.org', address: '789 Oak Ave, Lakeview', phone: '+1-456-789-0123', gender: 'female', status: 'Active', initials: 'TK' },
    { name: 'Sophia James', email: 'sjames@abc.net.au', address: '404 Spruce Dr, Willowfield', phone: '+1-890-123-4567', gender: 'female', status: 'Active', initials: 'SJ' },
    { name: 'Olivia Barnes', email: 'obarnes@xyz.com', address: '202 Birch Ln, Greenfield', phone: '+1-678-901-2345', gender: 'female', status: 'Inactive', initials: 'OB' },
    { name: 'Noah Carter', email: 'ncarter5@example.org', address: '303 Cedar Blvd, Rivertown', phone: '+1-789-012-3456', gender: 'female', status: 'Active', initials: 'NC' },
    { name: 'Mason King', email: 'mking7@xyz.com', address: '505 Walnut St, Bridgewater', phone: '+1-901-234-5678', gender: 'female', status: 'Inactive', initials: 'MK' },
    { name: 'Lucas Harper', email: 'lharper@abc.net.au', address: '707 Chestnut Ct, Highland', phone: '+1-123-456-7890', gender: 'male', status: 'Active', initials: 'LH' },
    { name: 'Liam Grayson', email: 'lgrayson3@abc.net.au', address: '101 Pine Rd, Brookfield', phone: '+1-567-890-1234', gender: 'male', status: 'Active', initials: 'LG' },
    { name: 'Jules Windsor', email: 'jwindsor@xyz.com', address: '456 Maple St, Centerville', phone: '+1-345-678-9012', gender: 'male', status: 'Inactive', initials: 'JW' },
    { name: 'Galen Slixby', email: 'gslixby@abc.net.au', address: '123 Elm St, Springfield', phone: '+1-234-567-8901', gender: 'female', status: 'Active', initials: 'GS' },
    { name: 'Ella Fisher', email: 'efisher@example.org', address: '606 Ash Ave, Sunnyvale', phone: '+1-012-345-6789', gender: 'male', status: 'Inactive', initials: 'EF' },
  ];

  selectedStatus: string = '';
  searchTerm: string = '';

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
