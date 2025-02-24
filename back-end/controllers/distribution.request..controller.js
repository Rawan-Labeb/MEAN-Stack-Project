const {
    getAllDistributionRequests,
    createDistributionRequest,
    getDistributionRequestById,
    deleteDistributionRequest,
    getDistributionRequestsByStatus,
    updateDistributionRequestStatusAndMessage

} = require("./../services/distribution.request.services");

const router = require("express").Router();
const express = require("express");
router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));


router.get("/getAllDistributionReqs", async (req, res) => {
    try {
        const result = await getAllDistributionRequests();
        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.post("/createDistReq", async (req, res) => { 
    try {
        const result = await  createDistributionRequest(req.body);
        if (result.success) {
            res.status(201).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/getDistReqById/:id", async (req, res) => {
    try {
        const result = await  getDistributionRequestById(req.params.id);
        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})



router.delete("/deleteDistReq/:id", async (req, res) => {
    try {
        const result = await  deleteDistributionRequest(req.params.id);
        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


router.get("/getDistReqsByStatus/:status", async (req, res) => {
    try {
        console.log(req.params.status)
        const result = await  getDistributionRequestsByStatus(req.params.status);
        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put("/changeDistReqStatus/:id", async (req, res) => {
    try {
        const result = await  updateDistributionRequestStatusAndMessage(req.params.id, req.body.status, req.body.message);
        if (result.success) {
            res.status(200).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})






module.exports = router;