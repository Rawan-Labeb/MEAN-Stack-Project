const category=require("../models/category.model")

module.exports.getCategories = async () => {
    try{
        const categories = await category.find({});
        return categories
    }catch (error)
    {
        throw error
    }
}

module.exports.getCategoryById = async(categoryId) => {
    try{
        const Category = await category.findOne({ _id:categoryId});
        if (!Category) {
            throw new Error("ID doesn't exist");
        }
        return Category;
    }catch(error)
    {
        throw error
    }
}
module.exports.getCategoryByName = async(categoryName) => {
    try{
        const Category = await category.findOne({ name:categoryName});
        if (!Category) {
            throw new Error("name doesn't exist");
        }
        return Category;
    }catch(error)
    {
        throw error
    }
}
module.exports.addCategory = async(data) => {
    try {
        const newCategory = new category(data);
        const savedCategory = await newCategory.save();
    
        return savedCategory
      } catch (error) {
        throw new Error("Error adding category: " + error.message);
      }
}

module.exports.updateCategory = async (categoryId, data) => {
    try {
      const updatedCategory = await category.findByIdAndUpdate(categoryId, data, { new: true });
      return updatedCategory;
    } catch (error) {
      throw new Error("Error updating category: " + error.message);
    }
  };

  module.exports.deleteCategoryById = async (id) => {
    try {
      const deletedCategory = await category.findByIdAndDelete(id);
      return deletedCategory;
    } catch (error) {
      throw new Error("Error deleting category by ID: " + error.message);
    }
  };