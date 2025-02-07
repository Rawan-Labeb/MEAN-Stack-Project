const asyncHandler = require("express-async-handler");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
require('dotenv').config() ; 
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createOrderFromCart = asyncHandler(async (req, res, next) => {
  try {
    const { userId, customerDetails, paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ message: `There is no cart for this user ${userId}` });
    }

    const items = cart.items.map(item => ({
      productId: item.product._id,
      price: item.price,
      quantity: item.quantity
    }));

    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

    const order = await Order.create({
      orderId: Date.now(), 
      customerId: cart.user,
      items,
      totalPrice,
      status: "Pending",
      paymentMethod,
      customerDetails,
      date: new Date()
    });

    const bulkOption = cart.items.map(item => ({
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
      }
    }));
    await Product.bulkWrite(bulkOption, {});

    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({ status: "success", data: order });
  } catch (error) {
    return res.status(500).json({ message: "Error creating order from cart" });
  }
});

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  try {
    const { userId, customerDetails } = req.body;
    const taxPrice = 0;
    const shippingPrice = 0;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: `There is no cart for this user ${userId}` });
    }
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.price;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      customerId: cart.user,
      items: cart.items.map(item => ({
        productId: item.product,
        price: item.price,
        quantity: item.quantity
      })),
      totalPrice: totalOrderPrice,
      paymentMethod: "Cash",
      customerDetails
    });

    if (order) {
      const bulkOption = cart.items.map(item => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
        }
      }));
      await Product.bulkWrite(bulkOption, {});
      await Cart.findOneAndDelete({ user: userId });
    }
    res.status(201).json({ status: "success", data: order });
  } catch (error) {
    return res.status(500).json({ message: `There is no cart for this user ${customerId}` });
  }
});

exports.getOne = asyncHandler(async (req, res, next) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id)
      .populate("customerId")
      .populate({
        path: "items.productId",
        model: "Product"
      });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ data: order });
  } catch (error) {
    return res.status(404).json({ message: "Order not found" });
  }
});

exports.getOrders = asyncHandler(async (req, res) => {
  const queryStringObj = { ...req.query };
  const excludesFields = ["page", "sort", "limit", "fields"];
  excludesFields.forEach(field => delete queryStringObj[field]);
  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  const endIndex = page * limit;
  const pagination = {};
  const documentCount = await Order.countDocuments();
  pagination.currentPage = page;
  pagination.limit = limit;
  pagination.numberPages = Math.ceil(documentCount / limit);
  if (endIndex < documentCount) {
    pagination.nextPage = page + 1;
  }
  if (skip > 0) {
    pagination.prevPage = page - 1;
  }
  const paginationResult = pagination;
  let mongooseQuery = Order.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit)
    .populate({
      path: "items.productId",
      model: "Product"
    });
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("-date");
  }
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery.select("-__v");
  }
  if (req.query.keyword) {
    let query = {};
    if (Order.modelName === "Order") {
      query.$or = [
        { title: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } }
      ];
    } else {
      query = { name: { $regex: req.query.keyword, $options: "i" } };
    }
    mongooseQuery = Order.find(query);
  }
  const orders = await mongooseQuery;
  res.status(200).json({ results: orders.length, paginationResult, data: orders });
});

exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById({ _id: id });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  await Order.deleteOne({ _id: id });
  res.status(200).json({ data: order });
});

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order Not Found" });
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order Not Found" });
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

exports.checkOut = asyncHandler(async (req, res, next) => {
  try {
    const { userId, customerDetails } = req.body;
    const taxPrice = 0;
    const shippingPrice = 0;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: `There is no such cart for user ${userId}` });
    }
    const cartPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.price;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      customerId: cart.user,
      items: cart.items.map(item => ({
        productId: item.product,
        price: item.price,
        quantity: item.quantity
      })),
      totalPrice: totalOrderPrice,
      paymentMethod: "Online",
      customerDetails
    });

    if (order) {
      const bulkOption = cart.items.map(item => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
        }
      }));
      await Product.bulkWrite(bulkOption, {});
    }

    const user = await User.findById(cart.user);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            product_data: { name: "Complete Payment", description: "-------" },
            unit_amount: totalOrderPrice * 100,
            currency: "egp"
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `http://localhost:4200/thank-you/${order._id}`,
      cancel_url: "http://localhost:4200/cart",
      customer_email: user.email,
      client_reference_id: userId
    });

    await Cart.updateOne(
      { user: userId },
      { $pull: { items: { _id: { $in: cart.items.map(item => item._id) } } } }
    );

    res.status(200).json({ status: "success", session });
  } catch (error) {
    return res.status(500).json({ message: "Error during checkout" });
  }
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order Not Found" });
  }
  const updatedOrder = await Order.updateOne(
    { _id: req.params.id },
    { status }
  );
  res.status(200).json({ status: "success", data: updatedOrder });
});

exports.getUserOrders = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user;
    const orders = await Order.find({ customerId: user.id }).populate({
      path: "items.productId",
      model: "Product"
    });
    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json({ data: orders });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

exports.getOrdersByStatus = asyncHandler(async (req, res, next) => {
  try {
    const status = req.params.status;
    const orders = await Order.find({ status }).populate("customerId").populate({
      path: "items.productId",
      model: "Product"
    });
    if (!orders) {
      return res.status(404).json({ message: "Orders not found" });
    }
    res.status(200).json({ data: orders });
  } catch (error) {
    return res.status(404).json({ message: "Orders not found" });
  }
});

exports.getUserOrdersById = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ customerId: userId }).populate({
      path: "items.productId",
      model: "Product"
    });
    if (!orders) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    res.status(200).json({ data: orders });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});
