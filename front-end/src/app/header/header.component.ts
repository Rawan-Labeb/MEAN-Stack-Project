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
    { id: 1, name: 'Eternity Perfume', price: 79.99 ,image: 'https://via.placeholder.com/100x100?text=Fragrance+A',
      quantity: 2},
    { id: 1, name: 'Eternity Perfume', price: 79.99 ,image: 'https://via.placeholder.com/100x100?text=Fragrance+A',
      quantity: 2},
    { id: 2, name: 'Ocean Breeze', price: 69.99 ,image: 'https://via.placeholder.com/100x100?text=Fragrance+A',
      quantity: 2}
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
  increaseQuantity(item: any): void {
    item.quantity++;
  }
  
  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }
  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1); 
  }
  calculateTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}