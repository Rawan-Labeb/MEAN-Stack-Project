const productRepo = require('../repos/product.repo');

const productService = {
    getAllProducts: async () => {
        try {
            const products = await productRepo.getAllProducts();
            return { success: true, data: products };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    getProductById: async (id) => {
        try {
            const product = await productRepo.getProductById(id);
            if (!product) {
                return { success: false, message: 'Product not found' };
            }
            return { success: true, data: product };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    createProduct: async (productData) => {
        try {
            const product = await productRepo.createProduct(productData);
            return { success: true, data: product };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    searchProducts: async (name) => {
        try {
            const query = { 
                name: { $regex: name, $options: 'i' },
                isActive: true 
            };
            const products = await productRepo.searchProducts(query);
            return { success: true, data: products };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    getProductsByPriceRange: async (min, max) => {
        try {
            const query = { isActive: true };
            if (min || max) {
                query.price = {};
                if (min) query.price.$gte = Number(min);
                if (max) query.price.$lte = Number(max);
            }
            const products = await productRepo.getProductsByPriceRange(query);
            return { success: true, data: products };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    getProductsByCategories: async (categories) => {
        try {
            const products = await productRepo.getProductsByCategories(categories);
            return { success: true, data: products };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    getProductsBySellerId: async (sellerId) => {
        try {
            const products = await productRepo.getProductsBySellerId(sellerId);
            return { success: true, data: products };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    updateProduct: async (id, productData) => {
        try {
            const product = await productRepo.updateProduct(id, productData);
            if (!product) {
                return { success: false, message: 'Product not found' };
            }
            return { success: true, data: product };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    deleteProduct: async (id) => {
        try {
            const result = await productRepo.deleteProduct(id);
            if (!result) {
                return { success: false, message: 'Product not found' };
            }
            return { success: true, message: 'Product deleted successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    getAllProductsAdmin: async () => {
        try {
            const products = await productRepo.getAllProductsAdmin();
            return { success: true, data: products };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    hardDeleteProduct: async (id) => {
        try {
            await productRepo.hardDeleteProduct(id);
            return { success: true, message: 'Product permanently deleted' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    toggleProductStatus: async (id) => {
        try {
            const product = await productRepo.toggleProductStatus(id);
            return { 
                success: true, 
                data: product,
                message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`
            };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    getProductsByCategory: async (categoryId) => {
        try {
            const products = await productRepo.getProductsByCategory(categoryId);
            return { success: true, data: products };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
};

module.exports = productService;