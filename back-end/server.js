const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const user = require("./controllers/user.controller")
const permission = require("./controllers/permission.controller");
require('dotenv').config();
const category=require("./controllers/category.controller")
const image = require('./controllers/media.controller');
const fileUpload = require("express-fileupload");
const app = express();

const productController = require('./controllers/product.controller');
const supplierController = require('./controllers/supplier.controller');

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
  }));
app.use(express.json());
app.use(express.urlencoded({extended:true}))

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Routes
    app.get('/', (req, res) => {
      res.json({ message: 'Hello from the back end!' });
    });

    // Product routes
    app.get('/api/products', productController.getAllProducts);
    app.get('/api/products/:id', productController.getProductById);
    app.post('/api/products', productController.createProduct);
    app.put('/api/products/:id', productController.updateProduct);
    app.delete('/api/products/:id', productController.deleteProduct);

    // Supplier routes
    app.get('/api/suppliers', supplierController.getAllSuppliers);
    app.get('/api/suppliers/:id', supplierController.getSupplierById);
    app.post('/api/suppliers', supplierController.createSupplier);
    app.put('/api/suppliers/:id', supplierController.updateSupplier);
    app.delete('/api/suppliers/:id', supplierController.deleteSupplier);

    // Error handling middleware - move after routes
    app.use((request, response) => {
      response.status(404).json({message: "not found"})
    });
    
    app.use((err, req, res, next) => {
      res.status(500).json({message: err+""})
    });

    // Port handling
    const ports = [3000, 3001, 3002];
    
    const tryPort = (index) => {
      if (index >= ports.length) {
        console.error('No available ports');
        process.exit(1);
      }
      
      const port = ports[index];
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy, trying next port`);
          tryPort(index + 1);
        }
      });
    };

    tryPort(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

  app.get('/', (req, res) => {
    res.json({ message: 'Hello from the back end!' });});
    app.use(fileUpload());

    app.use("/users", user);

    app.use("/permission", permission);

    app.use(category)
    app.use(image)

  app.use((request,response)=>{
    response.status(404).json({messege:"not found"})
   })
   app.use((err,req,res,next)=>{
    res.status(500).json({message:err+""})
   })