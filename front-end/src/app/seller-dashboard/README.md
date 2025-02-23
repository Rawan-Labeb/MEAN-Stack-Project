# Seller Dashboard API Documentation

## Base URL
```http
http://localhost:5000
```

# Get all products
GET /product/getAllProducts

# Get active products
GET /product/getActiveProducts

# Get deactivated products
GET /product/getDeactivatedProducts

# Get specific product
GET /product/getProductById/{id}

# Get products by category
GET /product/getProductsByCategory/{id}

# Create a new product
POST /product/createProduct
Content-Type: application/json

{
    "name": "string",
    "description": "string",
    "price": number,
    "quantity": number,
    "categoryId": "string",
    "sellerId": "string",
    "isActive": boolean,
    "images": string[]
}

Response: {
    "_id": "string",
    "name": "string",
    ...other fields
}

# Update a product
PUT /product/updateProduct/{id}
Content-Type: application/json

{
    "name": "string",
    "description": "string",
    "price": number,
    "quantity": number,
    "categoryId": "string",
    "sellerId": "string",
    "isActive": boolean,
    "images": string[]
}

# Activate product
POST /product/activeProduct/{id}

# Deactivate product
POST /product/deactiveProduct/{id}

# Upload images
POST /upload
Content-Type: multipart/form-data

Form-Data:
- Key: imageUrls
- Type: File (multiple)

Response: {
    "success": true,
    "imageUrls": [
        "https://ik.imagekit.io/your_id/products/image1.jpg",
        "https://ik.imagekit.io/your_id/products/image2.jpg"
    ]
}

# Get all categories
GET /categories

# Get active categories
GET /categories/get/active

# Get specific category
GET /categories/{id}
