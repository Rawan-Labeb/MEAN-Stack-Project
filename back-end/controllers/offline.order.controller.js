const {
    getAllOfflineOrders,
    getAllOrdersByBranchId,
    getOfflineOrderById,
    createOfflineOrder,
    cancelOfflineOrder
} = require("./../services/offline.orders.service")
const router = require("express").Router();
const express = require("express");
router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));


router.get("/getAllOfflineOrders", async (req, res) => {
    try{
        const result = await getAllOfflineOrders();
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.get("/getOfflineOrdersByBranchId/:branchId", async (req, res) => {
    try{
        const result = await getAllOrdersByBranchId(req.params.branchId);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.get("/getOfflineOrderbyId/:orderId", async (req, res) => {
    try{
        const result = await getOfflineOrderById(req.params.orderId);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(200).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.post("/createOfflineOrder", async (req, res) => {
    try{
        const result = await createOfflineOrder(req.body);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(201).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})


router.post("/cancelOfflineOrder/:orderId", async (req, res) => {
    try{
        const result = await cancelOfflineOrder(req.params.orderId);
        if (!result.success)
            return res.status(400).json(result.message);

        return res.status(201).json(result.message);

    } catch (error) {
        res.status(500).send(error.message);
    }
})





module.exports = router;