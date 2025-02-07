const Joi = require('joi');

const productValidationSchema = Joi.object({
    name: Joi.string()
        .required()
        .min(3)
        .max(100)
        .trim()
        .messages({
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name cannot exceed 100 characters',
            'any.required': 'Name is required'
        }),

    description: Joi.string()
        .max(500)
        .trim()
        .allow('')
        .messages({
            'string.max': 'Description cannot exceed 500 characters'
        }),

    price: Joi.number()
        .required()
        .min(0.01)
        .precision(2)
        .messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price must be at least 0.01',
            'any.required': 'Price is required'
        }),

    quantity: Joi.number()
        .required()
        .integer()
        .min(0)
        .messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be a whole number',
            'number.min': 'Quantity cannot be negative',
            'any.required': 'Quantity is required'
        }),

    categoryId: Joi.string()
        .required()
        .messages({
            'any.required': 'Category is required'
        }),

    sellerId: Joi.string()
        .required()
        .messages({
            'any.required': 'Seller is required'
        }),

    supplierId: Joi.string()
        .required()
        .messages({
            'any.required': 'Supplier is required'
        })
});

const validateProduct = (req, res, next) => {
    const { error } = productValidationSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errors = error.details.map(detail => detail.message);
        return res.status(400).json({ 
            success: false, 
            message: 'Validation failed', 
            errors 
        });
    }
    
    next();
};

module.exports = validateProduct;