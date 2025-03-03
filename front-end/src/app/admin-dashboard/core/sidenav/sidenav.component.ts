import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Branch } from 'src/app/_models/branch.model';
import { BranchService } from 'src/app/_services/branch.service';
import { SubInventoryService } from 'src/app/_services/sub-inventory.service';
import { SubInventory } from 'src/app/_models/sub-inventory.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  imports: [MatSidenavModule,MatIconModule,MatListModule,MatToolbarModule,MatMenuModule,MatDividerModule,RouterModule,CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent implements OnInit {
  branches: Branch[] = [];
  showSubMenu = false;
  loading = false;
  error: string | null = null;

  constructor(
    private branchService: BranchService,private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBranches();
  }

  async loadBranches(): Promise<void> {
    this.loading = true;
    this.error = null;
  
    try {
      const response = await firstValueFrom(this.branchService.getbranchesBasedOnType("offline"));
      console.log('✅ Branches response:', response);
      this.branches = response.map(branch => ({ ...branch, showSubSubMenu: false }));
      this.cdr.detectChanges();
    } catch (error) {
      console.error('❌ Error fetching branches:', error);
      this.error = 'Failed to load branches';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }    
  
  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;
    this.cdr.detectChanges();
  }

  toggleBranchMenu(branch: Branch, event: Event) {
    event.stopPropagation();
    branch.showSubSubMenu = !branch.showSubSubMenu;
    this.cdr.detectChanges();
  }
  showMenu = false;

toggleOnlineBranch() {
  this.showMenu = !this.showMenu;
  this.cdr.detectChanges();
}

}
