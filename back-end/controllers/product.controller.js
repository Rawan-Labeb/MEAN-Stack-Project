const mongoose = require('mongoose');
const productService = require('../services/product.service');
const Product = require('../models/product.model');
const Category = require('../models/category.model'); // Ensure Category model is imported

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const result = await productService.getAllProducts();
            if (result.success) {
                res.status(200).json(result.data);
            } else {
                res.status(500).json({ message: result.message });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getProductById: async (req, res) => {
        const result = await productService.getProductById(req.params.id);
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ message: result.message });
        }
    },

    createProduct: async (req, res) => {
        try {
            const result = await productService.createProduct(req.body);
            if (result.success) {
                res.status(201).json(result.data);
            } else {
                res.status(400).json({ message: result.message });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateProduct: async (req, res) => {
        const result = await productService.updateProduct(req.params.id, req.body);
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(404).json({ message: result.message });
        }
    },

    deleteProduct: async (req, res) => {
        const result = await productService.deleteProduct(req.params.id);
        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(404).json({ message: result.message });
        }
    },

    getBestSellers: async (req, res) => {
        try {
            const products = await Product.find({ isActive: true })
                .sort({ noOfSale: -1 })
                .limit(10)
                .populate('categoryId');
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAvailableProducts: async (req, res) => {
        try {
            const products = await Product.find({ 
                isActive: true,
                quantity: { $gt: 0 }  // Only products with quantity > 0
            }).populate('categoryId');
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    searchProducts: async (req, res) => {
        try {
            const products = await Product.find({
                name: { $regex: req.query.name, $options: 'i' },
                isActive: true
            }).populate('categoryId');
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getProductsByPriceRange: async (req, res) => {
        try {
            const products = await Product.find({
                price: { 
                    $gte: req.query.min || 0, 
                    $lte: req.query.max || Number.MAX_VALUE 
                },
                isActive: true
            }).populate('categoryId');
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getSellerProducts: async (req, res) => {
        try {
            const sellerId = req.params.sellerId;
            const products = await Product.find({ sellerId: sellerId })
                .populate('categoryId')
                .lean();
            
            console.log('Products being sent:', products);
            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching seller products:', error);
            res.status(500).json({ message: 'Error fetching products' });
        }
    },

    getAllProductsAdmin: async (req, res) => {
        try {
            const result = await productService.getAllProductsAdmin();
            if (result.success) {
                res.status(200).json(result.data);
            } else {
                res.status(400).json({ message: result.message });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    hardDeleteProduct: async (req, res) => {
        try {
            const result = await productService.hardDeleteProduct(req.params.id);
            if (result.success) {
                res.status(200).json({ message: result.message });
            } else {
                res.status(400).json({ message: result.message });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    toggleProductStatus: async (req, res) => {
        try {
            const result = await productService.toggleProductStatus(req.params.id);
            if (result.success) {
                res.status(200).json({ 
                    message: result.message,
                    data: result.data 
                });
            } else {
                res.status(400).json({ message: result.message });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getProductsByCategory: async (req, res) => {
        try {
            const categoryId = req.params.categoryId;
            
            // Validate categoryId format
            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                return res.status(400).json({ message: 'Invalid category ID format' });
            }

            const result = await productService.getProductsByCategory(categoryId);
            if (result.success) {
                res.status(200).json(result.data);
            } else {
                res.status(404).json({ message: result.message });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = productController;