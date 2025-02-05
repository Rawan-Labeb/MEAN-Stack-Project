const Cart = require('../models/cart.model');
const Product = require('../models/product.model'); 

const findProductById = async (productId) => {
  return await Product.findById(productId);
};

const createCart = async (req, res) => {
  try {
    const { user, items } = req.body;

    let userCart = await Cart.findOne({ user });

    if (userCart) {
      for (const item of items) {
        const product = await findProductById(item.product);
        if (!product) {
          return res.status(404).json({ error: `Product with ID ${item.product} not found` });
        }

        const existingItem = userCart.items.find(cartItem => cartItem.product.equals(item.product));

        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          userCart.items.push({
            product: item.product,
            quantity: item.quantity,
            price: product.price,
            image: product.images[0] 
          });
        }
      }

      await userCart.save();
      return res.status(200).json({ message: "Items added to existing cart", userCart });
    } else {
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

const addProductsToShoppingCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    let userCart = await Cart.findOne({ user: userId });
    const product = await findProductById(productId); 

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

const deleteProductFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    let userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const productIndex = userCart.items.findIndex(item => item.product.equals(productId));

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    userCart.items.splice(productIndex, 1);

    await userCart.save();

    res.json({ message: 'Product removed from cart successfully', userCart });
  } catch (error) {
    res.status(500).json({ error: 'Error removing product from cart: ' + error.message });
  }
};

module.exports = {
  createCart,
  getCartByUserId,
  updateCart,
  deleteCart,
  addProductsToShoppingCart,
  deleteProductFromCart
};