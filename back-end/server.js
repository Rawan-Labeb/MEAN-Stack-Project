const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const user = require("./controllers/user.controller")
const permission = require("./controllers/permission.controller");
require('dotenv').config();
const category=require("./controllers/category.controller")
const image = require('./controllers/media.controller');
const fileUpload = require("express-fileupload");
const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
  }));
app.use(express.json());
app.use(express.urlencoded({extended:true}))

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

  app.get('/', (req, res) => {
    res.json({ message: 'Hello from the back end!' });});
    app.use(fileUpload());

    app.use("/users", user);

    app.use("/permission", permission);

    app.use(category)
    app.use(image)

  app.use((request,response)=>{
    response.status(404).json({messege:"not found"})
   })
   app.use((err,req,res,next)=>{
    res.status(500).json({message:err+""})
   })