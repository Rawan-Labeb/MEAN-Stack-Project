const {getAllSubInventories} = require("./../services/sub.inventory.services");

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




module.exports = router;