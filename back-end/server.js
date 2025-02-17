// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const user = require("./controllers/user.controller");
// const permission = require("./controllers/permission.controller");
// const Complaint = require("./controllers/complaint.controller")
// const order = require("./controllers/order.controller");
// require('dotenv').config();

// // const app = express();

// const productController = require('./controllers/product.controller');
// const supplierController = require('./controllers/supplier.controller');
// const validateProduct = require('./middleware/productValidation');
// require('dotenv').config();
// const category=require("./controllers/category.controller")
// //const image = require('./controllers/media.controller');
// const fileUpload = require("express-fileupload");
// const app = express();
// const port = process.env.PORT ;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('Connected to MongoDB Atlas');

//     // Routes
//     app.get('/', (req, res) => {
//       res.json({ message: 'Hello from the back end!' });
//     });

//     // User routes
//     app.use("/api/users", user);
//     app.use("/api/permission", permission);
//     app.use("/api/order", order);

//     // Product routes
//     // app.get('/api/products', productController.getAllProducts);
//     app.post('/api/products', validateProduct, productController.createProduct);
//     app.get('/api/products/search', productController.searchProducts);
//     app.get('/api/products/price-range', productController.getProductsByPriceRange);
//     app.get('/api/products/best-sellers', productController.getBestSellers);
//     app.get('/api/products/available', productController.getAvailableProducts);
//     app.get('/api/products/:id', productController.getProductById);
//     app.put('/api/products/:id', validateProduct, productController.updateProduct);
//     app.delete('/api/products/:id', productController.deleteProduct);

//     // Supplier routes
//     app.get('/api/suppliers', supplierController.getAllSuppliers);
//     app.get('/api/suppliers/:id', supplierController.getSupplierById);
//     app.post('/api/suppliers', supplierController.createSupplier);
//     app.put('/api/suppliers/:id', supplierController.updateSupplier);
//     app.delete('/api/suppliers/:id', supplierController.deleteSupplier);

//     // Error handling middleware
//     app.use((req, res, next) => {
//       res.status(404).json({ message: "Route not found" });
//     });

//     app.use((err, req, res, next) => {
//       console.error(err.stack);
//       res.status(500).json({ message: err.message });
//     });

//     // Start server
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   })
//   .catch(err => {
//     console.error('MongoDB connection error:', err);
//     process.exit(1);
//   });


//   app.get('/', (req, res) => {
//     res.json({ message: 'Hello from the back end!' });});
//     app.use(fileUpload());

//     app.use("/users", user);

//     app.use("/permission", permission);
//     app.use("/complaint", Complaint);

//     app.use(category)
//     //app.use(image)

//   app.use((request,response)=>{
//     response.status(404).json({messege:"not found"})
//    })
//    app.use((err,req,res,next)=>{
//     res.status(500).json({message:err+""})
//    })

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userController = require("./controllers/user.controller");
const permissionController = require("./controllers/permission.controller");
const complaintController = require("./controllers/complaint.controller");
const orderController = require('./controllers/order.contorller');
const cartRoutes = require("./routes/cart.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const productController = require('./controllers/product.controller');
const supplierController = require('./controllers/supplier.controller');
const categoryController = require("./controllers/category.controller");
const validateProduct = require('./middleware/productValidation');
const fileUpload = require("express-fileupload");


const app = express();
const port = process.env.PORT || 5000;

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
    app.use("/api/users", userController);
    app.use("/api/permission", permissionController);
    app.use("/api/complaint", complaintController);
    app.use("/api/order", orderController);
    app.use("/api/category", categoryController);

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