// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

console.log("Received items:", req.body.items);
console.log("Received totalPrice:", req.body.totalPrice);

const calculateTax = async (items, currency) => {
  const taxCalculation = await stripe.tax.calculations.create({
    currency,
    customer_details: {
      address: {
        line1: "920 5th Ave",
        city: "Seattle",
        state: "WA",
        postal_code: "98104",
        country: "US",
      },
      address_source: "shipping",
    },
    line_items: items.map((item) => buildLineItem(item)),
  });

  return taxCalculation;
};

const buildLineItem = (item) => {
  return {
    amount: item.amount, // Amount in cents
    reference: item.id, // Unique reference for the item in the scope of the calculation
  };
};

// Securely calculate the order amount, including tax
const calculateOrderAmount = (items, taxCalculation) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total with any exclusive taxes on the server to prevent
  // people from directly manipulating the amount on the client
  let orderAmount = 1400;
  orderAmount += taxCalculation.tax_amount_exclusive;
  return orderAmount;
};

export default async function handler(req, res) {
  console.log("Request body:", req.body); 
  const { items, totalPrice } = req.body;
  
  if (!items || totalPrice === undefined) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
}


  try {
    const taxCalculation = await calculateTax(items, "eur");
    console.log(totalPrice);
    const amount = totalPrice * 100; // Convert to cents for Stripe

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        tax_calculation: taxCalculation.id
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error during payment intent creation:", error);
    res.status(500).json({ error: error.message });
  }
};
