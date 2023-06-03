// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.
import express from 'express';
import stripe from 'stripe';
import { createOrder } from '../controllers/orderController.js';
const router = express.Router();
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY)

let products;
let productQuantity;
router.post('/create-checkout-session', async (req, res) => {
    res.setHeader('ACCESS-CONTROL-ALLOW-ORIGIN','https://ecommerce-app-12.netlify.app')
    const { price, product, quantity, user } = req.body;

    products = product;
    productQuantity = quantity;
    const customer = await stripeInstance.customers.create({
        metadata: {
            email: user.email,
            // cart: JSON.stringify(req.body.cart),
            // total: req.body.data.total,
        }
    });
    let line_items = product.map((item) => {
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    images: [item.image.filePath],
                    metadata: {
                        id: item._id
                    },

                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }
    })
    const session = await stripeInstance.checkout.sessions.create({
        line_items,
        mode: 'payment',
        shipping_address_collection: {
            allowed_countries: ['US', 'CA', 'PK', 'IN'], // Replace with the list of countries you want to allow

        },
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/checkout-fail`,
    });

    res.send({ url: session.url });


});
// Webhooks  raw({ type: 'application/json' })
let endpointSecret;
// endpointSecret = process.env.WEBHOOK_SECRET;
router.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {



    let sig = request.headers['stripe-signature'];
    let eventType;
    let data;

    if (endpointSecret) {
        let event;
        try {
            event = stripeInstance.webhooks.constructEvent(request.body, sig, endpointSecret);
        } catch (error) {
            response.status(400).send(`Webhook Error: ${error.message}`)
            return;
        }
        data = event.data.object;
        eventType = event.type;
    } else {
        data = request.body.data.object;
        eventType = request.body.type;
    }

    if (eventType === "checkout.session.completed") {
        // stripeInstance.customers.retrieve(data.customer.toString()).then(customer => {
        //     console.log("Customer Details", customer)
        //     console.log("DATA", data)
        // })
        createOrder(data, products, productQuantity)
        console.log(data, products)
    }

    response.send();
});



export default router;
