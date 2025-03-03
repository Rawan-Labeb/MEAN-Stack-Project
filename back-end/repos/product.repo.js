const Product = require('../models/product.model');
const SubInventory = require("./../models/sub.inventory");
const MainInventory = require('../models/main.inventory.model');  
const mongoose = require('mongoose');


module.exports.getActiveProducts = async () => {
    try {
      const products = await Product.find({ isActive: true })
        .populate('categoryId')
        .populate('sellerId');
      
      return products;
    } catch (error) {
      console.error(error.message || "Could not get all products");
      throw new Error(error.message || "Could not get all products");
    }
};
  

module.exports.getDeactivatedProducts = async () => {
    try {
        const products = await Product.find({ isActive: false })
        .populate('categoryId')
        .populate('sellerId');
        
        return products;
    } catch (error) {
        console.error(error.message || "Could not get deactivated products");
        throw new Error(error.message || "Could not get deactivated products");
    }
};

module.exports.getAllProducts = async () => {
    try {
      const products = await Product.find({})
        .populate('categoryId')
        .populate('sellerId');
      
      return products;
    } catch (error) {
      console.error(error.message || "Could not get all products");
      throw new Error(error.message || "Could not get all products");
    }
  };


  module.exports.getProductById = async (id) => {
    try {
      const product = await Product.findById(id)
        .populate('categoryId')
        .populate('sellerId');
      
      return product;
    } catch (error) {
      console.error(error.message || "Could not get product by ID");
      throw new Error(error.message || "Could not get product by ID");
    }
  };



module.exports.createProduct = async (productData) => {
  try {
    const product = await Product.create(productData);
    return product;
  } catch (error) {
    console.error(error.message || "Could not create product");
    throw new Error(error.message || "Could not create product");
  }
};

module.exports.updateProduct = async (id, productData) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true })
        .populate('categoryId')
        .populate('sellerId');
      
      return updatedProduct;
    } catch (error) {
      console.error(error.message || "Could not update product");
      throw new Error(error.message || "Could not update product");
    }
  };



  module.exports.deactiveProduct = async (id) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      // Deactivate product
      const product = await Product.findByIdAndUpdate(
        id, 
        { isActive: false }, 
        { new: true }
      ).session(session);
  
      // Fetch all sub-inventories related to the product
      const subInventories = await SubInventory.find({ product: id }).session(session);
      if (subInventories.length != 0) {
        for (const subInventory of subInventories) {
            await SubInventory.findByIdAndUpdate(
              subInventory._id,
              { active: false },
              { new: true }
            ).session(session);
          }
      }
  
      await session.commitTransaction();
      session.endSession();
  
      return product;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error.message || "Could not deactivate product");
      throw new Error(error.message || "Could not deactivate product");
    }
  };



module.exports.activeProduct = async (id) => {
    try {
      const deletedProduct = await Product.findByIdAndUpdate(
        id, 
        { isActive: true }, 
        { new: true }
      );
  
      return deletedProduct;
    } catch (error) {
      console.error(error.message || "Could not active product");
      throw new Error(error.message || "Could not active product");
    }
  };


  module.exports.deleteProduct = async (id) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      
      return deletedProduct;
    } catch (error) {
      console.error(error.message || "Could not delete product");
      throw new Error(error.message || "Could not delete product");
    }
  };




module.exports.getProductsByCategory = async (categoryId) => {
  try {
    const products = await Product.find({
      categoryId: categoryId,
      isActive: true
    }).populate('categoryId')
      .populate('sellerId');

    return products;
  } catch (error) {
    console.error(error.message || "Could not get products by category");
    throw new Error(error.message || "Could not get products by category");
  }
};


module.exports.getProductsBySeller = async (sellerId) => {
  try {
    const products = await Product.find({
      sellerId: sellerId
    }).populate('categoryId')
      .populate('sellerId');

    return products;
  } catch (error) {
    console.error(error.message || "Could not get products by seller");
    throw new Error(error.message || "Could not get products by seller");
  }
};