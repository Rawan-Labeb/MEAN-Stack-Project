const {
    createProductRequest,
    getAllProductRequests,
    getProductRequestById,
    getProductRequestsForSeller,
    deleteProductRequest,
    updateProductRequestStatusAndMessage
} = require("./../services/product.reqest.services");

const router = require("express").Router();
const express = require("express");
router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));



router.post("/createProdReq", async (req, res) => {
    try {
        const result = await createProductRequest(req.body);
        if (result.success) {
            res.status(201).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/getAllProdReq", async (req, res) => {
    try {
        const result = await getAllProductRequests();
        if (result.success) {
            res.status(201).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/getProdReqById/:id", async (req, res) => {
    try {
        const result = await getProductRequestById(req.params.id);
        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/getProdReqForSeller/:sellerId", async (req, res) => {
    try {
        const result = await getProductRequestsForSeller(req.params.sellerId);
        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete("/deleteProdReq/:id", async (req, res) => {
    try {
        const result = await deleteProductRequest(req.params.id);
        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.post("/updateProdReqStatusAndMsg/:id", async (req, res) => {
    try {
        const result = await updateProductRequestStatusAndMessage(req.params.id, req.body.status, req.body.message);
        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;


