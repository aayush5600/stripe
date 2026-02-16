const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Stripe = require("stripe");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Stripe Setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Root Route (Fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Stripe Backend Running ✅",
  });
});

// Create Payment Intent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: "Invalid amount",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // amount in paise (INR smallest unit)
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error("Stripe Error:", error.message);

    res.status(500).json({
      error: "Payment Intent creation failed",
      details: error.message,
    });
  }
});

// Use Render Port OR default 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

