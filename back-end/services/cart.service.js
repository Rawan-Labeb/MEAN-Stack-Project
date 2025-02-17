const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

class CartService {
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

  async createCartService(cartData) {
    const cart = new Cart(cartData);
    return await cart.save();
  }

  async clearCartService(userId) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    if (cart) {
      for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.quantity += item.quantity;
          await product.save();
        }
      }

      cart.items = [];
      await cart.save();
    }
  }

  async getCart(userId) {
    return await this.findCurrentUserShoppingCart(userId);
  }

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

    await cart.save();

    product.quantity -= quantity;
    await product.save();

    return cart;
  }

  async deleteProductInShoppingCartService(userId, productId) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    const item = cart.items.find(item => item.product.equals(productId));

    if (item) {
      const product = await Product.findById(productId);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }

      cart.items = cart.items.filter(item => !item.product.equals(productId));
      await cart.save();
    }

    return cart;
  }

  async incItemInCart(userId, productId) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    const item = cart.items.find(item => item.product.equals(productId));

    if (!item) {
      throw new Error('Product not found in cart');
    }

    item.quantity += 1;
    await cart.save();

    const product = await Product.findById(productId);
    if (product) {
      product.quantity -= 1;
      await product.save();
    }

    return cart;
  }

  async decItemFromCart(userId, productId) {
    const cart = await this.findCurrentUserShoppingCart(userId);
    const item = cart.items.find(item => item.product.equals(productId));

    if (!item) {
      throw new Error('Product not found in cart');
    }

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items = cart.items.filter(item => !item.product.equals(productId));
    }

    await cart.save();

    const product = await Product.findById(productId);
    if (product) {
      product.quantity += 1;
      await product.save();
    }

    return cart;
  }

  calculateTotalPrice(cart) {
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  
  async createOrder(orderData) {
    try {
      const orderItems = [];
      let totalPrice = 0;

      for (const item of orderData.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        // Check if the requested quantity is available
        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient product quantity for product: ${item.productId}`);
        }

        // Reduce the product quantity
        product.quantity -= item.quantity;
        await product.save();

        orderItems.push({
          productId: item.productId,
          price: product.price,
          quantity: item.quantity
        });

        totalPrice += product.price * item.quantity;
      }

      const order = new Order({
        orderId: Math.floor(Math.random() * 1000000), // You can use another method to generate orderId
        customerId: orderData.userId,
        items: orderItems,
        totalPrice: totalPrice,
        status: orderData.status || 'Pending',
        paymentMethod: orderData.paymentMethod || 'Cash', // You can update the payment method as needed
        customerDetails: {
          firstName: orderData.customerDetails.firstName,
          lastName: orderData.customerDetails.lastName,
          address: {
            street: orderData.customerDetails.address.street,
            city: orderData.customerDetails.address.city,
            zipCode: orderData.customerDetails.address.zipCode
          },
          email: orderData.customerDetails.email,
          phone: orderData.customerDetails.phone
        },
        date: new Date()
      });

      return await order.save();
    } catch (error) {
      console.error('Error creating order:', error); // Log the error for debugging
      throw new Error('Error creating order');
    }
  }
}

module.exports = new CartService();

// const Cart = require('../models/cart.model');
// const Product = require('../models/product.model');

// class CartService {
//   // Find user's cart with populated product details
//   async findCurrentUserShoppingCart(userId) {
//     const cart = await Cart.findOne({ user: userId })
//       .populate({
//         path: 'items.product',
//         select: 'name price description imageCover'
//       });

//     if (!cart) {
//       return await this.createCartService({ user: userId, items: [] });
//     }

//     return cart;
//   }

//   // Create new cart
//   async createCartService(cartData) {
//     const cart = new Cart(cartData);
//     return await cart.save();
//   }

//    // Decrease quantity of an item in the cart
//    static async decItemFromCart(customerId, productId) {
//     // 1- Check if product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       throw new Error('Product not found');
//     }

//     const cart = await Cart.findOne({ user: customerId });
//     const item = cart.items.find(item => item.product.equals(productId));

//     if (!item) {
//       throw new Error('Product not found in cart');
//     }

//     // If quantity is greater than 1, decrease by 1
//     if (item.quantity > 1) {
//       item.quantity -= 1;
//     } else {
//       // If quantity is 1, remove the product from the cart
//       cart.items = cart.items.filter(item => !item.product.equals(productId));
//     }

//     return await cart.save();
//   }

//   // Increase quantity of an item in the cart
//   static async incItemInCart(customerId, productId) {
//     // 1- Check if product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       throw new Error('Product not found');
//     }

//     const cart = await Cart.findOne({ user: customerId });
//     const item = cart.items.find(item => item.product.equals(productId));

//     if (!item) {
//       throw new Error('Product not found in cart');
//     }

//     // Increase the quantity of the item by 1
//     item.quantity += 1;
//     return await cart.save();
//   }

//   // Add product to cart
//   async addToCartService(userId, productId, quantity = 1) {
//     const cart = await this.findCurrentUserShoppingCart(userId);
//     const product = await Product.findById(productId);
    
//     if (!product) {
//       throw new Error('Product not found');
//     }

//     const existingItem = cart.items.find(item => item.product.equals(productId));
    
//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       cart.items.push({
//         product: productId,
//         image: product.imageCover,
//         quantity,
//         price: product.price
//       });
//     }

//     return await cart.save();
//   }

//   // Remove product from cart
//   async deleteProductInShoppingCartService(userId, productId) {
//     const cart = await this.findCurrentUserShoppingCart(userId);
//     cart.items = cart.items.filter(item => !item.product.equals(productId));
//     return await cart.save();
//   }

//   // Clear entire cart
//   async clearCartService(userId) {
//     const cart = await this.findCurrentUserShoppingCart(userId);
//     cart.items = [];
//     if (cart) {
//       cart.items = [];
//       await cart.save();
//     }
//   }

//   // Calculate total cart price
//   calculateTotalPrice(cart) {
//     return cart.items.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);
//   }
// }

// module.exports = new CartService();
////
// Update product quantity in cart
//   async updateProductInShoppingCartService(userId, productId, quantity) {
//     if (quantity < 1) {
//       throw new Error('Quantity must be at least 1');
//     }

//     const cart = await this.findCurrentUserShoppingCart(userId);
//     const item = cart.items.find(item => item.product.equals(productId));
    
//     if (!item) {
//       throw new Error('Product not found in cart');
//     }

//     item.quantity = quantity;
//     return await cart.save();
//   }


//   const Cart = require('../models/cart.model');
// const Product = require('../models/product.model');

// class CartService {
//   // Find user's cart with populated product details
//   async findCurrentUserShoppingCart(userId) {
//     const cart = await Cart.findOne({ user: userId })
//       .populate({
//         path: 'items.product',
//         select: 'name price description imageCover'
//       });

//     if (!cart) {
//       return await this.createCartService({ user: userId, items: [] });
//     }

//     return cart;
//   }

//   // Create new cart
//   async createCartService(cartData) {
//     const cart = new Cart(cartData);
//     return await cart.save();
//   }

//   // Decrease quantity of an item in the cart
//   async decItemFromCart(userId, productId) {
//     const cart = await this.findCurrentUserShoppingCart(userId);
//     const item = cart.items.find(item => item.product.equals(productId));

//     if (!item) {
//       throw new Error('Product not found in cart');
//     }

//     // If quantity is greater than 1, decrease by 1
//     if (item.quantity > 1) {
//       item.quantity -= 1;
//     } else {
//       // If quantity is 1, remove the product from the cart
//       cart.items = cart.items.filter(item => !item.product.equals(productId));
//     }

//     await cart.save();

//     // Update product quantity in the database
//     const product = await Product.findById(productId);
//     if (product) {
//       product.quantity += 1; // Increase the product quantity in the database
//       await product.save();
//     }

//     return cart;
//   }

//   // Increase quantity of an item in the cart
//   async incItemInCart(userId, productId) {
//     const cart = await this.findCurrentUserShoppingCart(userId);
//     const item = cart.items.find(item => item.product.equals(productId));

//     if (!item) {
//       throw new Error('Product not found in cart');
//     }

//     // Increase the quantity of the item by 1
//     item.quantity += 1;
//     await cart.save();

//     // Update product quantity in the database
//     const product = await Product.findById(productId);
//     if (product) {
//       product.quantity -= 1; // Decrease the product quantity in the database
//       await product.save();
//     }

//     return cart;
//   }

//   // Add product to cart
//   async addToCartService(userId, productId, quantity = 1) {
//     const cart = await this.findCurrentUserShoppingCart(userId);
//     const product = await Product.findById(productId);
    
//     if (!product) {
//       throw new Error('Product not found');
//     }

//     const existingItem = cart.items.find(item => item.product.equals(productId));
    
//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       cart.items.push({
//         product: productId,
//         image: product.imageCover,
//         quantity,
//         price: product.price
//       });
//     }

//     await cart.save();

//     // Update product quantity in the database
//     product.quantity -= quantity;
//     await product.save();

//     return cart;
//   }

//   // Remove product from cart
//   async deleteProductInShoppingCartService(userId, productId) {
//     const cart = await this.findCurrentUserShoppingCart(userId);
//     const item = cart.items.find(item => item.product.equals(productId));

//     if (item) {
//       // Update product quantity in the database
//       const product = await Product.findById(productId);
//       if (product) {
//         product.quantity += item.quantity;
//         await product.save();
//       }

//       cart.items = cart.items.filter(item => !item.product.equals(productId));
//       await cart.save();
//     }

//     return cart;
//   }

//   // Clear entire cart
//   async clearCartService(userId) {
//     const cart = await this.findCurrentUserShoppingCart(userId);
//     if (cart) {
//       // Update product quantities in the database
//       for (const item of cart.items) {
//         const product = await Product.findById(item.product);
//         if (product) {
//           product.quantity += item.quantity;
//           await product.save();
//         }
//       }

//       cart.items = [];
//       await cart.save();
//     }
//   }

//   // Calculate total cart price
//   calculateTotalPrice(cart) {
//     return cart.items.reduce((total, item) => {
//       return total + (item.price * item.quantity);
//     }, 0);
//   }
// }

// module.exports = new CartService();