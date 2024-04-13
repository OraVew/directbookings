"use client"
"use client"
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function App() {
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;  // Flag to track mounted state

    const fetchClientSecret = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 1000 }),
      })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          if (!data.clientSecret) {
              throw new Error("No client secret in response");
          }
          setClientSecret(data.clientSecret);
          setLoading(false);
      })
      .catch(error => {
          console.error('Error fetching clientSecret:', error);
          setLoading(false);
      });
      
      } catch (error) {
        console.error('Error fetching clientSecret:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchClientSecret();

    return () => {
      isMounted = false;  // Clean up function
    };
  }, []);

  if (loading) {
    return <div>Loading payment form...</div>;
  }

  if (!clientSecret) {
    return <div>Failed to load payment form. Please try again later.</div>;
  }

  return (
    <div className="App">
      
      <Elements stripe={stripePromise} options={{ clientSecret }}>
  <CheckoutForm />
</Elements>
    </div>
  );
}
