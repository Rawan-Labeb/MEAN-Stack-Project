import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  imports: [MatSidenavModule,MatIconModule,MatListModule,MatToolbarModule,MatMenuModule,MatDividerModule,RouterModule,CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {

  showSubMenu = false;
  showSubSubMenu = false;

  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;
    if (!this.showSubMenu) {
      this.showSubSubMenu = false;
    }
  }

  toggleSubSubMenu(event: Event) {
    event.stopPropagation();
    this.showSubSubMenu = !this.showSubSubMenu;
  }

}
