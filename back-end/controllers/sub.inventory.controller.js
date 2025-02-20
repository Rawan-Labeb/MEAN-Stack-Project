const {
    getAllSubInventories,
    createSubInventory,
    getSubInventoryById,
    getSubInventoriesByBranchName,
    getActiveSubInventoriesByBranchName,
    getDeactiveSubInventoriesByBranchName,
    activeSubInventory,
    deactiveSubInventory,
    deleteSubInventory,
    decreaseSubInventoryQuantity,
    increaseSubInventoryQuantity

} = require("./../services/sub.inventory.services");

const router = require("express").Router();
const express = require("express");
router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));


router.get("/getAllSubInventories", async (req, res) => {
    try{
        const result = await getAllSubInventories();
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);


    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.post("/CreateSubInventory", async (req, res) => {
    try{
        const result = await createSubInventory(req.body);
        // console.log(result)
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(201).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get("/getSubInventoryById/:id", async (req, res) => {
    try{
        const result = await getSubInventoryById(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get("/getSubInventoriesByBranchName/:branchName", async(req, res) => {
    try{
        const result = await getSubInventoriesByBranchName(req.params.branchName);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get("/getActiveSubInventoriesByBranchName/:branchName", async(req, res) => {
    try{
        const result = await getActiveSubInventoriesByBranchName(req.params.branchName);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get("/getDeactiveSubInventoriesByBranchName/:branchName", async(req, res) => {
    try{
        const result = await getDeactiveSubInventoriesByBranchName(req.params.branchName);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.post("/activeSubInventory/:id", async(req, res) => {
    try{
        const result = await activeSubInventory(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.post("/deactiveSubInventory/:id", async(req, res) => {
    try{
        const result = await deactiveSubInventory(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.delete("/deleteSubInventory/:id", async(req, res) => {
    try{
        const result = await deleteSubInventory(req.params.id);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.put("/decreaseSubInventoryQuantity/:id", async (req, res) => {
    try{
        const result = await decreaseSubInventoryQuantity(req.params.id, req.body.quantityToDecrease);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.put("/increaseSubInventoryQuantity/:id", async (req, res) => {
    try{
        const result = await increaseSubInventoryQuantity(req.params.id, req.body.quantityToIncrease);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})



module.exports = router;