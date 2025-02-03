const {uploadImage}=require("../utils/media.utils")
const express=require('express')
const router=express.Router()
router.post('/upload', async (req, res,next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }
  
    const file = req.files.file;
  
    try {
      const uploadResponse = await uploadImage(file);
      res.json({ imageUrl: uploadResponse.url });
    } catch (error) {
      next(error)
    }
  });

  module.exports=router