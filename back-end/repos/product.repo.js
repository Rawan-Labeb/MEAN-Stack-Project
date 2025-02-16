const Product = require('../models/product.model');
const productRepo = {
    getAllProducts: async () => {
        return await Product.find({ isActive: true })
            .populate('categoryId')
            .populate('sellerId')
            .populate('supplierId');
    },

    getProductById: async (id) => {
        return await Product.findById(id)
            .populate('categoryId')
            .populate('sellerId')
            .populate('supplierId');
    },

    createProduct: async (productData) => {
        try {
            const product = new Product({
                name: productData.name,
                description: productData.description,
                price: productData.price,
                quantity: productData.quantity,
                categoryId: productData.categoryId,
                sellerId: productData.sellerId,
                supplierId: productData.supplierId,
                images: productData.images,
            });
            return await product.save();
        } catch (error) {
            throw error;
        }
    },

    updateProduct: async (id, productData) => {
        return await Product.findByIdAndUpdate(
            id, 
            productData, 
            { new: true }
        ).populate('categoryId')
         .populate('sellerId')
         .populate('supplierId');
    },

    deleteProduct: async (id) => {
        return await Product.findByIdAndUpdate(
            id, 
            { isActive: false }, 
            { new: true }
        );
    },

    searchProducts: async (query) => {
        return await Product.find({
            name: { $regex: query, $options: 'i' },
            isActive: true
        }).populate('categoryId')
          .populate('sellerId')
          .populate('supplierId');
    },

    getProductsByPriceRange: async (minPrice, maxPrice) => {
        return await Product.find({
            price: { 
                $gte: minPrice || 0, 
                $lte: maxPrice || Number.MAX_VALUE 
            },
            isActive: true
        }).populate('categoryId')
          .populate('sellerId')
          .populate('supplierId');
    },

    getProductsByCategories: async (categoryIds) => {
        return await Product.find({
            categoryId: { $in: categoryIds },
            isActive: true
        }).populate('categoryId')
          .populate('sellerId')
          .populate('supplierId');
    }
};

module.exports = productRepo;