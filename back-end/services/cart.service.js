const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

class CartService {
  // Find user's cart with populated product details
  async findCurrentUserShoppingCart(userId) {
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name price description imageCover'
      });

    if (!cart) {
      return await this.createCartService({ user: userId, items: [] });
    }

    return cart;
  }

  // Create new cart
  async createCartService(cartData) {
    const cart = new Cart(cartData);
    return await cart.save();
  }

  // Add product to cart
  async addToCartService(userId, productId, quantity = 1) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    const existingItem = cart.items.find(item => item.product.equals(productId));
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        image: product.imageCover,
        quantity,
        price: product.price
      });
    }

    return await cart.save();
  }

  // Update product quantity in cart
  // async updateProductInShoppingCartService(userId, productId, quantity) {
  //   if (quantity < 1) {
  //     throw new Error('Quantity must be at least 1');
  //   }

  //   const cart = await this.findCurrentUserShoppingCart(userId);
  //   const item = cart.items.find(item => item.product.equals(productId));
    
  //   if (!item) {
  //     throw new Error('Product not found in cart');
  //   }

  //   item.quantity = quantity;
  //   return await cart.save();
  // }
  async updateProductInShoppingCartService(userId, productId, quantity) {
    if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
    }

    const cart = await this.findCurrentUserShoppingCart(userId);
    const item = cart.items.find(item => item.product.equals(productId));

    if (!item) {
        throw new Error('Product not found in cart');
    }

    item.quantity = quantity;  
    return await cart.save();     
}


  // Remove product from cart
  async deleteProductInShoppingCartService(userId, productId) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    cart.items = cart.items.filter(item => !item.product.equals(productId));
    return await cart.save();
  }

  // Clear entire cart
  async clearCartService(userId) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    cart.items = [];
    return await cart.save();
  }

  // Calculate total cart price
  calculateTotalPrice(cart) {
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
}

module.exports = new CartService();