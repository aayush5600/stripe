require('dotenv').config();

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'inr',
    payment_method_types: ['upi'],
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(4242, () => console.log('Server running on port 4242'));
