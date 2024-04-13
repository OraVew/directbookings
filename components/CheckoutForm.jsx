import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  CardElement
} from "@stripe/react-stripe-js";
import styles from './BookingForm.module.css';
import { useForm } from 'react-hook-form';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export default function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [priceBreakdown, setPriceBreakdown] = React.useState({
    baseRate: 0,
    guestFee: 0,
    cleaningFee: 0,
    addOns: {}
  });

  const calculatePrice = (data) => {
    const startDate = new Date(data.startdate + 'T' + data.starttime);
    const endDate = new Date(data.enddate + 'T' + data.endtime);
    const durationHours = Math.abs(endDate - startDate) / 36e5; // Converts milliseconds to hours
  
    let baseRate = 100;
    const dayOfWeek = startDate.getDay();
    const startHour = startDate.getHours();
  
    if (dayOfWeek === 5 || dayOfWeek === 6) { // Adjust rate for weekends
      if (startHour < 17) baseRate = 110;
      else if (startHour >= 17 && startHour < 21) baseRate = 120;
      else if (startHour >= 21 || dayOfWeek === 0) baseRate = 150;
    }
  
    let extraGuestFee = data.guests > 19 ? (data.guests <= 29 ? 10 : 20) : 0;
    let cleaningFee = data.guests > 20 ? 125 : 50;
  
    let addOnFees = 0;
    let breakdown = {
      baseRate: baseRate * durationHours,
      guestFee: extraGuestFee * durationHours,
      cleaningFee: cleaningFee,
      addOns: {}
    };
  
    if (data.extraRoom) {
      let extraRoomCost = 50 * durationHours;
      addOnFees += extraRoomCost;
      breakdown.addOns.extraRoom = extraRoomCost;
    }
    if (data.photographer) {
      let photographerCost = 100 * durationHours;
      addOnFees += photographerCost;
      breakdown.addOns.photographer = photographerCost;
    }
    if (data.allInclusive) {
      let allInclusiveCost = 350;
      addOnFees += allInclusiveCost;
      breakdown.addOns.allInclusive = allInclusiveCost;
    }
  
    let totalCost = breakdown.baseRate + breakdown.guestFee + breakdown.cleaningFee + addOnFees;
  
    return { totalCost, breakdown };
  };

  const fetchPrice = async () => {
    try {
      // Prepare the payload to send to your API
      console.log(totalPrice)
      const paymentIntentData = {
        // Convert totalPrice to the smallest currency unit, e.g., cents if using USD
        amount: totalPrice * 100,
      };
  
      console.log("Data sent to server:", paymentIntentData);

      // Fetch call to the server to create a PaymentIntent with the specified amount
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Pass the paymentIntentData as the body, properly stringified
        body: JSON.stringify(paymentIntentData),
      });
  
      // Handle the response from your server
      const paymentIntentResponse = await response.json();
  
      if (response.ok) {
        // If the response is successful, use the client secret to proceed with the payment
        const result = await stripe.confirmCardPayment(paymentIntentResponse.clientSecret, {
          // Additional payment method details go here
          // e.g., card: elements.getElement(CardElement)
        });
  
        // Handle the result of the payment attempt
        if (result.error) {
          setMessage(result.error.message);
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            setMessage('Payment successful!');
            // Additional steps upon successful payment
          }
        }
      } else {
        // If the response is not ok, handle errors returned from your server
        setMessage(paymentIntentResponse.error);
      }
    } catch (error) {
      // Catch any errors that occurred during the fetch call
      setMessage(error.message);
    } finally {
      setIsLoading(false); // Stop loading indication regardless of the outcome
    }
  }
  
  
  const onConfirmDetails = (data) => {
    const { totalCost, breakdown } = calculatePrice(data);
    setTotalPrice(totalCost);
    setPriceBreakdown(breakdown);
    setIsLoading(false);
  };
  

  const onPaymentSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded or Elements are not ready.
      return;
    }

    const cardElement = elements.getElement(CardElement);
if (!cardElement) {
    console.log("CardElement not found.");
    return;
}
  
    setIsLoading(true); // Start loading indication.
  
    try {
      // Fetch the latest price before submitting the form
      await fetchPrice();
  
          // Your existing form submission logic
          const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
         });
         
      
  
      // Handle the result of the payment attempt
      if (result.error) {
        setMessage(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setMessage('Payment successful!');
          // Additional steps upon successful payment
        }
      }
    } catch (error) {
      // Catch any errors
      setMessage(error.message);
    } finally {
      setIsLoading(false); // Stop loading indication
    }
  };
  
  
  
  
    
  
  

  return (
    <form id="payment-form" onSubmit={handleSubmit(onPaymentSubmit)}>
      {/* Event details form */}
      <div className="event-details">
      <div>
                <label htmlFor="date">Start Date of Event:</label>
                    <input className={styles.formInput} type="date" {...register("startdate", { required: true })} />
                    {errors.date && <span className={styles.error}>This field is required</span>}
                </div>
                <div>
                    <label htmlFor="time">Start Time:</label>
                    <input className={styles.formInput} type="time" {...register("starttime", { required: true })} />
                    {errors.time && <span className={styles.error}>This field is required</span>}
                </div>
                <div>
                    <label htmlFor="date">End Date of Event:</label>
                    <input className={styles.formInput} type="date" {...register("enddate", { required: true })} />
                    {errors.date && <span className={styles.error}>This field is required</span>}
                </div>
                <div>
                    <label htmlFor="time">End Time:</label>
                    <input className={styles.formInput} type="time" {...register("endtime", { required: true })} />
                    {errors.time && <span className={styles.error}>This field is required</span>}
                </div>
                <div>
                    <label htmlFor="guests">Number of Guests:</label>
                    <input className={styles.formInput} type="number" {...register("guests", { required: true, min: 2, max: 40 })} />
                    {errors.guests && <span className={styles.error}>Guest count must be between 2 and 40</span>}
                </div>
                <div>
                    <label htmlFor="extraRoom">Extra Room ($50/hour):</label>
                    <input className={styles.checkbox} type="checkbox" {...register("extraRoom")} />
                </div>
                <div>
                    <label htmlFor="photographer">Photographer ($100/hour):</label>
                    <input className={styles.checkbox} type="checkbox" {...register("photographer")} />
                </div>
                <div>
                    <label htmlFor="allInclusive">All Inclusive Package ($350 flat):</label>
                    <input className={styles.checkbox} type="checkbox" {...register("allInclusive")} />
                </div>
                <div>
                    <label htmlFor="eventPlanning">Event Planning (Custom):</label>
                    <textarea className={styles.textarea} {...register("eventPlanning")} />
                </div>
      </div>
      <button type="button" onClick={handleSubmit(onConfirmDetails)}>Confirm Details</button>

      <div><h3>Total Balance: ${totalPrice}</h3></div>
    <div>
      <h4>Price Breakdown:</h4>
      <ul>
        <li>Base Rate: ${priceBreakdown.baseRate}</li>
        <li>Extra Guest Fee: ${priceBreakdown.guestFee}</li>
        <li>Cleaning Fee: ${priceBreakdown.cleaningFee}</li>
        {Object.keys(priceBreakdown.addOns).map(addOn => (
          <li key={addOn}>{addOn.charAt(0).toUpperCase() + addOn.slice(1)}: ${priceBreakdown.addOns[addOn]}</li>
        ))}
      </ul>
    </div>

    {totalPrice > 0 && (
        <>
          <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
          <button disabled={!stripe || !elements} onClick={(e) => onPaymentSubmit(e)}>
    Pay now
</button>
        </>
      )}

    {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
