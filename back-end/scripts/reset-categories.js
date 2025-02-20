const mongoose = require('mongoose');
const Category = require('../models/category.model');
require('dotenv').config();

async function resetCategories() {
  try {
    
    const mongoUrl = 'mongodb://127.0.0.1:27017/mean_stack_db';
    await mongoose.connect(mongoUrl);
    
    // Delete all existing categories
    await Category.deleteMany({});
    console.log('Deleted existing categories');

    // Create new categories
    const newCategories = [
      {
        name: 'Men',
        description: 'Men\'s clothing and accessories',
        isActive: true
      },
      {
        name: 'Women',
        description: 'Women\'s clothing and accessories',
        isActive: true
      },
      {
        name: 'Unisex',
        description: 'Unisex clothing and accessories',
        isActive: true
      }
    ];

    await Category.insertMany(newCategories);
    console.log('New categories created successfully');

    // Print the new categories
    const categories = await Category.find({});
    console.log('Current categories:', categories);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetCategories();