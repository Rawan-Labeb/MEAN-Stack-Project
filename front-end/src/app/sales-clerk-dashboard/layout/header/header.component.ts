import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent {
  @Input() pageTitle: string = 'Sales Clerk Dashboard';
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }
}