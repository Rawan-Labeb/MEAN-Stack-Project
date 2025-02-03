const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const User = require('../models/user.model');
const Supplier = require('../models/supplier.model');

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find({ isActive: true })
                .populate('categoryId')
                .populate('sellerId')
                .populate('supplierId');
            res.status(200).json(products);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }
    },

    getProductById: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id)
                .populate('categoryId')
                .populate('sellerId')
                .populate('supplierId');
            
            if (!product || !product.isActive) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createProduct: async (req, res) => {
        try {
            const product = new Product({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                prevPrice: req.body.prevPrice,
                images: req.body.images,
                quantity: req.body.quantity,
                sellerId: req.body.sellerId,
                supplierId: req.body.supplierId,
                categoryId: req.body.categoryId
            });
            const newProduct = await product.save();
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            product.isActive = false;
            await product.save();
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = productController;