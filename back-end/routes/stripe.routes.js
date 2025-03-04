const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51Qya0nG2gT4oJXi9B235B0VJSnnlse2VtUc44p2eNHbTd8co4PLdbRxXfvfPvKkIg9e14uLEmK52pvvBHbMCdY9a00e1HOxAIl'); 

router.post('/create-checkout-session', async (req, res) => {
    try {
        const value=req.body;
        console.log(value);
        
        const line_items = value.items.map(product => ({
            price_data: {
                currency: "usd", // Set the currency as USD
                product_data: {
                    name: product.productId // Use the product's name
                },
                unit_amount: ((product.price) * 100).toFixed(0) // Convert price to cents (Stripe requires amounts in cents)
            },
            quantity: product.quantity // Use the product's quantity
        }))
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // Specify the payment method (e.g., card)
            line_items:line_items,
            mode: 'payment', // Use 'subscription' for recurring payments
            success_url: 'http://localhost:4200/success', 
            cancel_url: 'http://localhost:4200/cart', 
        });

        res.json({ session });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'An error occurred while creating the checkout session.' });
    }
});

module.exports = router;