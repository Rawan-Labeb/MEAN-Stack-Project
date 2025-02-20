const mongoose = require('mongoose');
const Category = require('../models/category.model');
require('dotenv').config();

const categories = [
  {
    _id: new mongoose.Types.ObjectId('65f1f3d93e02b6db8b432e01'),
    name: 'Men',
    description: 'Men\'s clothing and accessories',
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId('65f1f3d93e02b6db8b432e02'),
    name: 'Women',
    description: 'Women\'s clothing and accessories',
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId('65f1f3d93e02b6db8b432e03'),
    name: 'Unisex',
    description: 'Unisex clothing and accessories',
    isActive: true
  }
];

async function seedCategories() {
  try {
    // Connect to MongoDB Atlas using environment variable
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing categories
    await Category.deleteMany({});
    
    // Insert new categories
    await Category.insertMany(categories);
    
    console.log('Categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();