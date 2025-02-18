const mongoose = require('mongoose');
const SubInventory = require("./../models/sub.inventory");

module.exports.createSubInventory = async (data) => {
    try {
      const newSubInventory = await SubInventory.create(data);
      return newSubInventory;
    } catch (error) {
      throw new Error("Could not create sub-inventory");
    }
  };
  
  module.exports.getAllSubInventories = async () => {
    try {
      const subInventories = await SubInventory.find().populate('mainInventory product branch').exec();
      return subInventories;
    } catch (error) {
      throw new Error("Could not get all sub-inventories");
    }
  };

  module.exports.getSubInventoryById = async (id) => {
    try {
      const subInventory = await SubInventory.findById(id).populate('mainInventory product branch').exec();
      return subInventory;
    } catch (error) {
      throw new Error("Could not get sub-inventory by ID");
    }
  };
  
  module.exports.updateSubInventoryById = async (id, data) => {
    try {
      const updatedSubInventory = await SubInventory.findByIdAndUpdate(id, data, { new: true }).exec();
      return updatedSubInventory;
    } catch (error) {
      throw new Error("Could not update sub-inventory by ID");
    }
  };

  module.exports.deleteSubInventoryById = async (id) => {
    try {
      const deletedSubInventory = await SubInventory.findByIdAndDelete(id).exec();
      return deletedSubInventory;
    } catch (error) {
      throw new Error("Could not delete sub-inventory by ID");
    }
  };
  
  module.exports.incrementSales = async (id, amount) => {
    try {
      const updatedSubInventory = await SubInventory.findByIdAndUpdate(
        id, 
        { $inc: { numberOfSales: amount } }, 
        { new: true }
      ).exec();
      return updatedSubInventory;
    } catch (error) {
      throw new Error("Could not increment sales");
    }
  };

