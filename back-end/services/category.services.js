const repo=require("../repos/category.repo")

module.exports.getAllCategories =async () => 
{
    try{
        const categories = await repo.getCategories();
        return {success: true, message: categories};
    }catch (error)
    {
        throw error
    }
}

module.exports.getCategoryById =async (categoryId) => 
{
    try{
        const category = await repo.getCategoryById(categoryId);
        return {success: true, message: category};
    }catch (error)
    { 
        throw error
    }
}
module.exports.getCategoryByName =async (categoryName) => 
{
    try{
        const category = await repo.getCategoryByName(categoryName);
        return {success: true, message: category};
    }catch (error)
    { 
        throw error
    }
}
module.exports.addCategory=async (data) => 
{
    try{
        const savedCategory = await repo.addCategory(data);
        return {success: true, message: savedCategory};
    }catch (error)
    { 
        throw new Error("Error adding category: " + error.message);
    }
}

module.exports.updateCategory = async (categoryId, data) => {
    try {
      const updatedCategory = await repo.updateCategory(categoryId, data);
  
      if (!updatedCategory) {
        throw new Error("Category not found");
      }
      return { success: true, message: updatedCategory };
    } catch (error) {
      throw new Error("Error updating category: " + error.message);
    }
  };

  module.exports.deleteCategoryById = async (id) => {
    try {
      const deletedCategory = await repo.deleteCategoryById(id);
      if (!deletedCategory) {
        throw new Error("Category not found");
      }
      return { success: true, message: "Category deleted successfully" };
    } catch (error) {
      throw new Error("Error deleting category by ID: " + error.message);
    }
  };
  
