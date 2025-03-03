const {
    getAllProducts,
    getActiveProducts,
    getDeactivatedProducts,
    getProductById: getProductByIdFromRepo,
    createProduct,
    updateProduct,
    activeProduct,
    deactiveProduct,
    deleteProduct,
    getProductsByCategory,
    getProductsBySeller
} = require('../repos/product.repo');

const {
    getUserById
} = require("./../services/user.service")

const {
    getCategoryById
} = require("../services/category.services")

module.exports.getAllProducts = async () => {
    try
    {
        const allProds = await getAllProducts();
        return {success:true, message: allProds}
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}

module.exports.getDeactivatedProducts = async () => {
    try
    {
        const alldectiveProds = await getDeactivatedProducts();
        return {success:true, message: alldectiveProds}
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


module.exports.getActiveProducts = async () => {
    try
    {
        const allActiveProds = await getActiveProducts();
        return {success:true, message: allActiveProds}
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


module.exports.getProductById = async (id) => {
    try
    {
        const chk = await validateProdId(id);
        if(!chk.valid)
            return {success: false, message: chk.message};

        return {success: true,message: chk.message};
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


module.exports.createProduct = async (productData) => {
    try
    {
        const chk = await validateOnCreateAndUpdate(productData);
        if (!chk.valid)
            return {success: false, message: chk.message};

        const prod = await createProduct(productData);
        return {success: true, message: prod};
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


module.exports.updateProduct = async (id, productData) => {
    try
    {
        const chkId = await validateProdId(id);
        if (!chkId.valid)
            return {success: false, message: chkId.message};

        const chk = await validateOnCreateAndUpdate(productData);
        if (!chk.valid)
            return {success: false, message: chk.message};
        

        if (productData.quantity <= 0 )
            return {success: false, message: "Invalid Quantity"};

        const prod = await updateProduct(id, productData);
        return {success: true, message: prod};
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}

module.exports.activeProduct = async (id) => 
{
    try
    {
        const chkId = await validateProdId(id);
        if (!chkId.valid)
            return {success: false, message: chkId.message};

        const prod = await activeProduct(id);
        return {success: true, message: prod};
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}

module.exports.deactiveProduct = async (id) => {
    try
    {
        const chkId = await validateProdId(id);
        if (!chkId.valid)
            return {success: false, message: chkId.message};
        const prod = await deactiveProduct(id);
        return {success: true, message: prod};
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}

module.exports.deleteProduct = async (id) => {
    try 
    {
        const chkId = await validateProdId(id);
        if (!chkId.valid)
            return {success: false, message: chkId.message};

        if (chkId.message.distributedItems > 0)
            return {success: false, message: "Can not Delete this product"};

        const prod = await deleteProduct(id);
        return {success: true, message: prod};
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


module.exports.getProductsByCategory = async (categoryId) => {
    try
    {
        const chkCategory = await getCategoryById(categoryId);
        if (!chkCategory)
            return {success: false, message: "No Category With that id"};

        const prods = await getProductsByCategory(categoryId);
        return {success: true, message: prods};
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


module.exports.getProductsBySeller = async (sellerId) => {
    try
    {
        const userChk = await getUserById(sellerId);

        if (!userChk.success)
            return {success: false, message: userChk.message};

        const prodForSeller = await getProductsBySeller(sellerId);

        return {success: true, message: prodForSeller};


    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


const validateOnCreateAndUpdate = async (productData) => {
    
    // Check if name is present and is a non-empty string
    if (!productData.name || typeof productData.name !== 'string' || productData.name.trim() === '')
        return {valid: false, message: "Name is required and must be a non-empty string."}


    // Check if description is present and is a non-empty string
    if (!productData.description || typeof productData.description !== 'string' || productData.description.trim() === '') 
        return {valid: false, message: "Description is required and must be a non-empty string."}

    // Check if price is present and is a number greater than zero
    if (!productData.price || typeof productData.price !== 'number' || productData.price <= 0) 
        return {valid: false, message: "Price is required and must be a number greater than zero."}

    // Check if categoryId is a valid ObjectId
    if (!productData.categoryId)
        return {valid: false, message: "Category Id id Required"};

    const chkCategory = await getCategoryById(productData.categoryId);
    if (!chkCategory) 
        return {valid: false, message: "No Category With That Id"}

    const chkSeller = await getUserById(productData.sellerId);
    
    if (!chkSeller.success)
        return {valid:false, message: chkSeller.message};

    if (chkSeller.message.role == 'seller')
    {
        if (!chkSeller.message.isActive)
            return {valid: false, message: "Can not make this operation User Not Active"}
    }


    return { valid: true, message: 'Validation passed' };  // Validation passed
};
    




const validateProdId = async (id) => {
    if (!id)
        return {valid: false, message: "Id Should Be Passed"};

    const chkProd = await getProductByIdFromRepo(id);

    if(!chkProd)
        return {valid: false, message: "No Product With that Id"};
    
    return {valid: true, message: chkProd};
}

