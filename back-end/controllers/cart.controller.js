// const CartService = require('../services/cart.service');

// class CartController {
//   async getCart(req, res) {
//     try {
//       const cart = await CartService.getCart(req.params.userId);
//       res.status(200).json(cart);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching cart', error });
//     }
//   }

//   async clearCart(req, res) {
//     try {
//       await CartService.clearCartService(req.params.userId);
//       res.status(204).send();
//     } catch (error) {
//       res.status(500).json({ message: 'Error clearing cart', error });
//     }
//   }

//   async incItemInCart(req, res) {
//     try {
//       const cart = await CartService.incItemInCart(req.params.userId, req.params.productId);
//       res.status(200).json(cart);
//     } catch (error) {
//       res.status(500).json({ message: 'Error increasing item quantity', error });
//     }
//   }

//   async decItemFromCart(req, res) {
//     try {
//       const cart = await CartService.decItemFromCart(req.params.userId, req.params.productId);
//       res.status(200).json(cart);
//     } catch (error) {
//       res.status(500).json({ message: 'Error decreasing item quantity', error });
//     }
//   }
// }

// module.exports = new CartController();


const Cart = require('../models/cart.model');
const Product = require('../models/product.model'); 
const CartService=require('../services/cart.service');
const findProductById = async (productId) => {
  return await Product.findById(productId);
};

const decItemFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    // ابحث عن السلة الخاصة بالمستخدم
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found for this user" });
    }

    // تحقق مما إذا كان المنتج موجودًا في السلة
    const itemIndex = cart.items.findIndex(item => item.product.equals(productId));

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    const item = cart.items[itemIndex];
    
    // إذا كانت الكمية أكبر من 1 ، انقص الكمية
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      // إذا كانت الكمية 1 فقط، قم بإزالة المنتج من السلة
      cart.items.splice(itemIndex, 1);
    }

    // حفظ التغييرات
    await cart.save();

    res.status(200).json({ message: "Product quantity decreased", userCart: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Increase quantity of a product in the cart
// const incItemInCart = async (req, res) => {
//   try {
//     const { userId, productId } = req.params;

//     // ابحث عن السلة الخاصة بالمستخدم
//     const cart = await Cart.findOne({ user: userId }).populate('items.product');

//     if (!cart) {
//       return res.status(404).json({ error: "Cart not found for this user" });
//     }

//     // تحقق مما إذا كان المنتج موجودًا في السلة
//     const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);

//     if (itemIndex === -1) {
//       return res.status(404).json({ error: "Product not found in cart" });
//     }

//     const item = cart.items[itemIndex];
//     const product = item.product;

//     // تحقق إذا كانت الكمية المطلوبة تتجاوز المخزون
//     if (item.quantity + 1 > product.stock) {
//       return res.status(400).json({ error: `Cannot increase quantity beyond available stock of ${product.stock}` });
//     }

//     // زيادة الكمية
//     item.quantity += 1;

//     // حفظ التغييرات
//     await cart.save();

//     res.status(200).json({ message: "Product quantity increased", userCart: cart });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const incItemInCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // ابحث عن السلة الخاصة بالمستخدم وتأكد من أنك تقوم بعمل populate للمنتج
    const cart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name description price isActive quantity') // إضافة الحقول المطلوبة هنا
      .exec();

    if (!cart) {
      return res.status(404).json({ error: "Cart not found for this user" });
    }

    // تحقق مما إذا كان المنتج موجودًا في السلة
    const itemIndex = cart.items.findIndex(item => item.product.equals(productId));

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // زيادة الكمية
    const item = cart.items[itemIndex];
    if (item.quantity < item.product.quantity) { // التأكد من أنه لا يتجاوز المخزون
      item.quantity += 1;
      await cart.save();
      return res.status(200).json({ message: "Product quantity increased", userCart: cart });
    } else {
      return res.status(400).json({ error: "Cannot increase quantity beyond available stock" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createCart = async (req, res) => {
  try {
    const { user, items } = req.body;

    // Check if the user already has a cart
    let userCart = await Cart.findOne({ user });

    if (userCart) {
      // If the user already has a cart, merge the new items into the existing cart
      for (const item of items) {
        const product = await findProductById(item.product);
        if (!product) {
          return res.status(404).json({ error: `Product with ID ${item.product} not found` });
        }

        // Check if the product already exists in the cart
        const existingItem = userCart.items.find(cartItem => cartItem.product.equals(item.product));

        if (existingItem) {
          // If the product exists, update the quantity
          existingItem.quantity += item.quantity;
        } else {
          // If the product does not exist, add it to the cart
          userCart.items.push({
            product: item.product,
            quantity: item.quantity,
            price: product.price,
            image: product.images[0] // Assuming the first image is the main image
          });
        }
        console.log("Received order request:", req.body);

      }

      // Save the updated cart
      await userCart.save();
      return res.status(200).json({ message: "Items added to existing cart", userCart });
    } else {
      // If the user does not have a cart, create a new one
      const newCart = new Cart(req.body);
      await newCart.save();
      return res.status(201).json(newCart);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate({ user: req.params.userId }, req.body, { new: true, runValidators: true });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json({ message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const removeProductFromCart = async (req, res) => {
  try {
      const { userId, productId } = req.params;

      // ابحث عن السلة الخاصة بالمستخدم
      const cart = await Cart.findOne({ user: userId });

      if (!cart) {
          return res.status(404).json({ error: "Cart not found for this user" });
      }

      // تحقق مما إذا كان المنتج موجودًا في السلة
      const itemIndex = cart.items.findIndex(item => item.product.equals(productId));

      if (itemIndex === -1) {
          return res.status(404).json({ error: "Product not found in cart" });
      }

      // إزالة العنصر من المصفوفة
      cart.items.splice(itemIndex, 1);

      // حفظ التغييرات
      await cart.save();

      res.status(200).json({ message: "Product removed from cart successfully", userCart: cart });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const addProductsToShoppingCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    let userCart = await Cart.findOne({ user: userId });
    const product = await findProductById(productId); // استخدام الدالة findProductById

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!userCart) {
      if (quantity > product.quantity) {
        quantity = product.quantity;
      }
      userCart = new Cart({
        user: userId,
        items: [{ product: productId, quantity, price: product.price, image: product.images[0] }],
      });
      await userCart.save();
    } else {
      const existingItem = userCart.items.find(item => item.product.equals(productId));
      if (existingItem) {
        if (existingItem.quantity + quantity > product.quantity) {
          existingItem.quantity = product.quantity;
        } else {
          existingItem.quantity += quantity;
        }
      } else {
        if (quantity > product.quantity) {
          quantity = product.quantity;
        }
        userCart.items.push({ product: productId, quantity, price: product.price, image: product.images[0] });
      }
      await userCart.save();
    }
    res.json({ message: "Product added to cart successfully", userCart });
  } catch (error) {
    res.status(500).json({ error: "Error adding product to cart: " + error });
  }
};
const getProductFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // البحث عن العربة الخاصة بالمستخدم
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // البحث عن المنتج داخل العربة
    const product = cart.items.find(item => item.product._id.toString() === productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // إرجاع بيانات المنتج داخل العربة
    res.json(product);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

// Other controller functions...

// Retrieve product details from cart by user id and product id

};
// Retrieve product details from cart by user id and product id
const getProductDetailsFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
const mongoose = require('mongoose');

const createOrder = async (req, res) => {
  const { customerId } = req.body;  // الحصول على الـ userId من body

  if (!customerId || customerId.length !== 24) {
      return res.status(400).json({ error: "Invalid or missing customerId" });
  }

  console.log("🛒 Received order request for customerId:", customerId);

  try {
      const order = await CartService.createOrder(req.body);
      res.status(201).json(order);
  } catch (error) {
      res.status(500).json({ message: 'Error creating order', error });
  }
};


module.exports = {
  createCart,
  getCartByUserId,
  updateCart,
  deleteCart,
  addProductsToShoppingCart,
  removeProductFromCart,
  getProductFromCart,
  incItemInCart,
  decItemFromCart,
  getProductDetailsFromCart,
  createOrder
};
////////
// const {
//   findCurrentUserShoppingCart,
//   createCartService,
//   updateProductInShoppingCartService,
//   deleteProductInShoppingCartService,
//   clearCartService,
// } = require('../services/cart.service');
// const { findProductById } = require('../services/product.service');

// const getCurrentUserShoppingCart = async (req, res) => {
//   try {
//     const userCart = await findCurrentUserShoppingCart(req.user._id);
//     if (!userCart) {
//       return res.status(404).json("The cart with the given current user was not found");
//     }
//     res.json(userCart);
//   } catch (error) {
//     res.status(500).json({ error: "Error getting shopping cart: " + error });
//   }
// };

// const addProductsToShoppingCart = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
//     const user = req.user;
//     let userCart = await findCurrentUserShoppingCart(user._id);
//     if (!userCart) {
//       const product = await findProductById(productId);
//       if (quantity > product.quantity) {
//         quantity = product.quantity;
//       }
//       await createCartService({
//         user: user._id,
//         items: [{ product: productId, quantity, price: product.price }],
//       });
//       userCart = await findCurrentUserShoppingCart(user._id);
//     } else {
//       const existingItem = userCart.items.find(item => item.product.equals(productId));
//       if (existingItem) {
//         if (existingItem.quantity + quantity > existingItem.product.quantity) {
//           existingItem.quantity = existingItem.product.quantity;
//         } else {
//           existingItem.quantity += quantity;
//         }
//       } else {
//         const product = await findProductById(productId);
//         if (quantity > product.quantity) {
//           quantity = product.quantity;
//         }
//         userCart.items.push({ product: productId, quantity, price: product.price });
//       }
//       await userCart.save();
//     }
//     res.json({ message: "Product added to cart successfully", userCart });
//   } catch (error) {
//     res.status(500).json({ error: "Error adding product to cart: " + error });
//   }
// };

// const updateProductInShoppingCart = async (req, res) => {
//   try {
//     const user = req.user;
//     const { productId } = req.params;
//     const { quantity } = req.body;
//     const userCart = await updateProductInShoppingCartService(user._id, productId, quantity);
//     res.json({ message: "Product quantity updated successfully", userCart });
//   } catch (error) {
//     res.status(500).json({ error: "Error updating product quantity: " + error });
//   }
// };

// const deleteProductInShoppingCart = async (req, res) => {
//   try {
//     const user = req.user;
//     const { productId } = req.params;
//     const userCart = await deleteProductInShoppingCartService(user._id, productId);
//     res.json({ message: "Item deleted from cart successfully", userCart });
//   } catch (error) {
//     res.status(500).json({ error: "Error deleting product from cart: " + error });
//   }
// };

// const clearCart = async (req, res) => {
//   try {
//     const user = req.user;
//     const userCart = await clearCartService(user._id);
//     res.json({ message: "Cart cleared successfully", userCart });
//   } catch (error) {
//     res.status(500).json({ error: "Error clearing cart: " + error });
//   }
// };

// module.exports = {
//   getCurrentUserShoppingCart,
//   addProductsToShoppingCart,
//   updateProductInShoppingCart,
//   deleteProductInShoppingCart,
//   clearCart,
// };