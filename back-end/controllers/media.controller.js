// const Product = require("../models/product.model");
// const User = require("../models/user.model");
// const Category = require("../models/category.model");
// const imagekit = require("../utils/media.utils");
// const express=require('express')
// const router=express.Router()
// router.post('/upload', async (req, res) => {
//   try {
//     if (!req.file || !req.body.type || !req.body.id) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // رفع الصورة إلى ImageKit أو أي خدمة تخزين
//     const uploadedImage = await imagekit.upload({
//       file: req.file.buffer,
//       fileName: req.file.originalname,
//     });

//     const { type, id } = req.body;
//     let model;

//     // تحديد نوع الجدول الذي سيتم حفظ الصورة فيه
//     switch (type) {
//       case "product":
//         model = Product;
//         break;
//       case "user":
//         model = User;
//         break;
//       case "category":
//         model = Category;
//         break;
//       default:
//         return res.status(400).json({ message: "Invalid type" });
//     }

//     // تحديث قاعدة البيانات بالرابط الجديد
//     const item = await model.findById(id);
//     if (!item) return res.status(404).json({ message: `${type} not found` });

//     // إذا كان المنتج أو الكاتيجوري يمكن أن يحتوي على صور متعددة، نخزنها كمصفوفة
//     if (type === "product" || type === "category") {
//       item.images = [...(item.images || []), uploadedImage.url];
//     } else {
//       item.imageUrl = uploadedImage.url; // للمستخدم، نخزن صورة واحدة فقط
//     }

//     await item.save();

//     res.status(200).json({ message: "Image uploaded successfully", imageUrl: uploadedImage.url });
//   } catch (error) {
//     res.status(500).json({ message: "Error uploading image", error: error.message });
//   }
// });

  module.exports=router