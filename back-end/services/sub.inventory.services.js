const {
    getAllSubInventories,
    createSubInventory
} = require("./../repos/sub.inventory.repo");

const {
    getMainInventoryById
} = require("./../services/main.inventory.services");

const {getProductById} = require("./../repos/product.repo")

module.exports.getAllSubInventories = async () => {
    try
    {
        const SubInventories = await getAllSubInventories();
        return {success:true, message: SubInventories}
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


module.exports.createSubInventory = async (data) => {
    try
    {
        const dataChk = await validateCreateAndUpdateData();
        if (!dataChk.valid)
            return {success: false, message: dataChk.message};

        const subInventory = await createSubInventory(data);

        return {success:true, message: subInventory}
    }catch (error)
    {
        return {success:false, message: error.message};
    }
}


const validateCreateAndUpdateData = async (data) => 
{
    if (!data.mainInventory)
        return {valid: false, message: "Main Inventory Data Should Be passed"};
    const mInventorychk = await getMainInventoryById(data.mainInventory);
    if (!mInventorychk.valid)
        return {valid: false, message: "No Main Inventory with the id Passed"};

    if (data.quantity > mInventorychk.message.quantity)
        return {valid: false, message: "Invalid Quantity"};



    if (!data.product)
        return {valid: false, message: "Product Data Should Be passed"};

    const prodChk = await getProductById(data.product);
    if (!prodChk)
        return {valid: false, message: "No Product with the given id"};


    return {success: true, message: "Validation Passed Successfully"};        
}