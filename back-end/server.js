const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const user = require("./controllers/user.controller");
const permission = require("./controllers/permission.controller");
const Complaint = require("./controllers/complaint.controller");
require('dotenv').config();

const productController = require('./controllers/product.controller');
const productRoutes = require('./routes/product.routes');

const supplierController = require('./controllers/supplier.controller');
const validateProduct = require('./middleware/productValidation');
const category = require("./controllers/category.controller");
const fileUpload = require("express-fileupload");
const app = express();
const port = process.env.PORT;
const upload = require("./controllers/media.controller");
const order = require("./controllers/order.controller");

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
    app.use("/api/users", user);
    app.use("/api/permission", permission);
    app.use("/api/order", order);
    app.use("/api/category", category);
    app.use("/api/upload", upload);

    // Use product routes
    app.use('/api/products', productRoutes);

    // Supplier routes
    app.get('/api/suppliers', supplierController.getAllSuppliers);
    app.get('/api/suppliers/:id', supplierController.getSupplierById);
    app.post('/api/suppliers', supplierController.createSupplier);
    app.put('/api/suppliers/:id', supplierController.updateSupplier);
    app.delete('/api/suppliers/:id', supplierController.deleteSupplier);

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