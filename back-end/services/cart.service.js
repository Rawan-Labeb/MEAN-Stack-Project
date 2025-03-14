const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const SubInventory = require('../models/sub.inventory');

class CartService {
  
  async findCurrentUserShoppingCart(userId) {
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.subInventory',
        populate: {
          path: 'product',
          select: 'name price description images isActive'
        }
      })
      .populate('items.branch');
  
    if (!cart) {
      return await this.createCartService({ user: userId, items: [] });
    }
  
    return cart;
  }
  async createCartService(cartData) {
    const cart = new Cart(cartData);
    return await cart.save();
  }


  async clearCartService(userId) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    
    if (cart) {
      for (const item of cart.items) {
        const subInventory = await SubInventory.findById(item.subInventory);
        if (subInventory) {
          subInventory.quantity += item.quantity;
          await subInventory.save();
        }
      }
  
      cart.items = [];
      await cart.save();
    }
  }
  

  async getCart(userId) {
    return await this.findCurrentUserShoppingCart(userId);
  }

  async addToCartService(userId, subInventoryId, quantity = 1) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    const subInventory = await SubInventory.findById(subInventoryId).populate('product');
  
    if (!subInventory || !subInventory.active || subInventory.quantity < quantity) {
      throw new Error('Sub-inventory item not available or insufficient stock');
    }
  
    const existingItem = cart.items.find(item => item.subInventory.equals(subInventoryId));
  
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        subInventory: subInventoryId,
        branch: subInventory.branch,
        quantity,
        price: subInventory.product.price,
        image: subInventory.product.images[0]
      });
    }
  
    await cart.save();
    return cart;
  }
  

  async deleteProductInShoppingCartService(userId, subInventoryId) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    const item = cart.items.find(item => item.subInventory.equals(subInventoryId));
  
    if (item) {
      const subInventory = await SubInventory.findById(subInventoryId);
      if (subInventory) {
        subInventory.quantity += item.quantity;
        await subInventory.save();
      }
  
      cart.items = cart.items.filter(item => !item.subInventory.equals(subInventoryId));
      await cart.save();
    }
  
    return cart;
  }

  async incItemInCart(userId, subInventoryId) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    const item = cart.items.find(item => item.subInventory.equals(subInventoryId));
  
    if (!item) {
      throw new Error('Item not found in cart');
    }
  
    const subInventory = await SubInventory.findById(subInventoryId);
    if (!subInventory || subInventory.quantity <= item.quantity) {
      throw new Error('Cannot increase quantity beyond available stock');
    }
  
    item.quantity += 1;
    await cart.save();
  
    subInventory.quantity -= 1;
    await subInventory.save();
  
    return cart;
  }
  

  async decItemFromCart(userId, subInventoryId) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    const item = cart.items.find(item => item.subInventory.equals(subInventoryId));
  
    if (!item) {
      throw new Error('Item not found in cart');
    }
  
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items = cart.items.filter(item => !item.subInventory.equals(subInventoryId));
    }
  
    await cart.save();
  
    const subInventory = await SubInventory.findById(subInventoryId);
    if (subInventory) {
      subInventory.quantity += 1;
      await subInventory.save();
    }
  
    return cart;
  }
  


  calculateTotalPrice(cart) {
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  
}

module.exports = new CartService();
