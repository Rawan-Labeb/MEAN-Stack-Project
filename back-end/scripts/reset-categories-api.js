const axios = require('axios');

const API_URL = 'http://localhost:5000/api/category';

const categories = [
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

async function resetCategories() {
  try {
    // Delete all existing categories
    await axios.delete(`${API_URL}/categories`);
    console.log('Deleted all existing categories');

    // Create new categories
    for (const category of categories) {
      const result = await axios.post(`${API_URL}/categories`, category);
      console.log(`Created category: ${result.data.name}`);
    }

    // Verify new categories
    const finalResponse = await axios.get(`${API_URL}/categories`);
    console.log('New categories:', finalResponse.data);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Install axios if not already installed
resetCategories(); 