import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [CommonModule,RouterLink],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // Mock cart items (replace with actual cart logic)
  cartItems = [
    { id: 1, name: 'Eternity Perfume', price: 79.99 },
    { id: 1, name: 'Eternity Perfume', price: 79.99 },
    { id: 2, name: 'Ocean Breeze', price: 69.99 }
  ];

  // Get the total number of items in the cart
  getCartItemCount(): number {
    return this.cartItems.length;
  }

  // Clear the cart (optional functionality)
  clearCart(): void {
    this.cartItems = [];
  }
  
  selected: string = 'home';
  updateSelect(selectedd: string): void {
    this.selected = selectedd;
  }
}