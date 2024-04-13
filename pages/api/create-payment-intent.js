// pages/api/create-payment-intent.js

import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// This should be an async function that handles the POST request
export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Your logic for creating a PaymentIntent
        try {
            const { amount } = req.body;
            console.log("Received from client:", req.body);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount, // ensure this is in the smallest unit of currency
                currency: 'usd',
                payment_method_types: ['card'],
            });

            // await stripe.prices.create(
            //   {
            //     unit_amount: paymentIntent.amount
            //   }
            // )
            res.status(200).json({ clientSecret: paymentIntent.client_secret });
        } catch (err) {
            // handle errors
            res.status(500).json({ statusCode: 500, message: err.message });
        }
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}

