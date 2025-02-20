const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const productController = require('./controllers/product.controller');
const supplierController = require('./controllers/supplier.controller');
const categoryController = require("./controllers/category.controller");
const validateProduct = require('./middleware/productValidation');
const fileUpload = require("express-fileupload");

const app = express();
const port = process.env.PORT;

const order = require("./controllers/order.contorller"); // تأكد من استخدام المسار الصحيح
const user = require("./controllers/user.controller"); // تأكد من استيراد وحدة user
const permission = require("./controllers/permission.controller"); // تأكد من استيراد وحدة permission
const Complaint = require("./controllers/complaint.controller"); // تأكد من استيراد وحدة Complaint
const category = require("./controllers/category.controller"); // تأكد من استيراد وحدة category
const cartRoutes = require("./routes/cart.routes"); // تأكد من استيراد وحدة cartRoutes
const checkoutRoutes = require("./routes/checkout.routes"); // تأكد من استيراد وحدة checkoutRoutes

const mainInventory = require("./controllers/main.inventory.controller");
const subInventory = require("./controllers/sub.inventory.controller");
const upload = require("./controllers/media.controller");
const branch = require("./controllers/branch.controller");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');

    // Routes
    app.get('/', (req, res) => {
      res.json({ message: 'Hello from the back end!' });
    });

    // API routes with /api prefix
    app.use("/users", user);
    app.use("/permission", permission);
    app.use("/order", order);
    app.use("/mainInventory", mainInventory);
    app.use("/subInventory", subInventory);
    app.use("/complain", Complaint);
    app.use(category);
    app.use(upload);
    app.use(branch);

    // Product routes
    app.get('/api/products', productController.getAllProducts);
    app.post('/api/products', validateProduct, productController.createProduct);
    app.get('/api/products/search', productController.searchProducts);
    app.get('/api/products/price-range', productController.getProductsByPriceRange);
    app.get('/api/products/best-sellers', productController.getBestSellers);
    app.get('/api/products/available', productController.getAvailableProducts);
    app.get('/api/products/:id', productController.getProductById);
    app.put('/api/products/:id', validateProduct, productController.updateProduct);
    app.delete('/api/products/:id', productController.deleteProduct);

    // Supplier routes
    app.get('/api/suppliers', supplierController.getAllSuppliers);
    app.get('/api/suppliers/:id', supplierController.getSupplierById);
    app.post('/api/suppliers', supplierController.createSupplier);
    app.put('/api/suppliers/:id', supplierController.updateSupplier);
    app.delete('/api/suppliers/:id', supplierController.deleteSupplier);

    // Cart routes
    app.use("/api/cart", cartRoutes);
    app.use("/api/checkout", checkoutRoutes);

    const expressListRoutes = require('express-list-routes'); 
    expressListRoutes(app);
    console.log("✅ cart.routes.js has been loaded successfully!");

    app.post('/api/checkout', (req, res) => {
      const { userId } = req.body;
      res.json({ message: 'Checkout successful', userId });
    });

    // Error handling middleware
    app.use((req, res, next) => {
      res.status(404).json({ message: "Route not found" });
    });

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: err.message });
    });

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });