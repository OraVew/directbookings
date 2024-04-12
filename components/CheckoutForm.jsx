import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import styles from './BookingForm.module.css';
import { useForm } from 'react-hook-form';

export default function CheckoutForm() {
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
  

  const onConfirmDetails = (data) => {
    const { totalCost, breakdown } = calculatePrice(data);
    setTotalPrice(totalCost);
    setPriceBreakdown(breakdown);  // Assuming you have a state to store this breakdown
  };

  const onPaymentSubmit = async (e) => {
    e.preventDefault();
  
    if (!stripe || !elements) {
      return;
    }
  
    setIsLoading(true);
  
    // Send the total price to the server to create/update the payment intent
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items,  // Assuming 'items' is an array of item details
        totalPrice: totalPrice,  // This is the total price calculated
      }),
    });
  
    const paymentIntentResponse = await response.json();
  
    if (response.ok) {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Customize return URL after payment
          return_url: "http://localhost:3000/payment-success",
        },
        // Use the client secret returned from the server
        payment_intent: paymentIntentResponse.clientSecret
      });
  
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Your payment is being processed.");
      }
    } else {
      setMessage(paymentIntentResponse.error);
    }
  
    setIsLoading(false);
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
        <button className={styles.button} disabled={isLoading || !stripe || !elements}>
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </button>
      </>
    )}

    {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
