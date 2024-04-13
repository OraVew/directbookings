import axios from 'axios';
import React, { useState } from "react";
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
  
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [priceBreakdown, setPriceBreakdown] = useState({
    baseRate: 0,
    guestFee: 0,
    cleaningFee: 0,
    addOns: {}
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const [checkedState, setCheckedState] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
  });
  const [allChecked, setAllChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    const newCheckedState = { ...checkedState, [event.target.name]: event.target.checked };
    setCheckedState(newCheckedState);
    setAllChecked(Object.values(newCheckedState).every(checked => checked));
  };

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

  const onConfirmDetails = async (data) => {
    const { totalCost, breakdown } = calculatePrice(data);
    setTotalPrice(totalCost);
    setPriceBreakdown(breakdown);
    setIsConfirmed(true);
  
    const calendarDetails = {
      startDate: data.startdate,
      startTime: data.starttime,
      endDate: data.enddate,
      endTime: data.endtime,
      guests: data.guests,
      extraRoom: data.extraRoom,
      photographer: data.photographer,
      allInclusive: data.allInclusive,
      eventPlanning: data.eventPlanning,
    };
  
    // Trigger Zapier workflow
    try {
      const response = await axios.post('https://hooks.zapier.com/hooks/catch/17285769/3n68n5r/', calendarDetails, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Zapier workflow triggered: ', response.data);
    } catch (error) {
      console.log('Failed to trigger Zapier workflow: ', error);
    }
  };
  
  const onPaymentSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
  
    setIsLoading(true);
  
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        totalPrice: totalPrice,
      }),
    });
  
    const paymentIntentResponse = await response.json();
  
    if (response.ok) {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:3000/payment-success",
        },
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

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit(onPaymentSubmit)}>
      {!isConfirmed ? (
        <div className="event-details">
          <div>
            <label htmlFor="date">Start Date of Event:</label>
            <input className={styles.formInput} type="date" {...register("startdate", { required: true })} />
            {errors.startdate && <span className={styles.error}>This field is required</span>}
          </div>
          <div>
            <label htmlFor="time">Start Time:</label>
            <input className={styles.formInput} type="time" {...register("starttime", { required: true })} />
            {errors.starttime && <span className={styles.error}>This field is required</span>}
          </div>
          <div>
            <label htmlFor="date">End Date of Event:</label>
            <input className={styles.formInput} type="date" {...register("enddate", { required: true })} />
            {errors.enddate && <span className={styles.error}>This field is required</span>}
          </div>
          <div>
            <label htmlFor="time">End Time:</label>
            <input className={styles.formInput} type="time" {...register("endtime", { required: true })} />
            {errors.endtime && <span className={styles.error}>This field is required</span>}          </div>
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
          <button type="button" onClick={handleSubmit(onConfirmDetails)}>Confirm Details</button>
        </div>
      ) : (
<div>
  <div>
    <label className="checkbox-label">
      <input
        type="checkbox"
        name="checkbox1"
        checked={checkedState.checkbox1}
        onChange={handleCheckboxChange}
      />
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac ante non metus interdum sollicitudin. Quisque vitae semper sem, non convallis lacus.
    </label>
  </div>
  <div>
    <label className="checkbox-label">
      <input
        type="checkbox"
        name="checkbox2"
        checked={checkedState.checkbox2}
        onChange={handleCheckboxChange}
      />
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac ante non metus interdum sollicitudin. Quisque vitae semper sem, non convallis lacus.
    </label>
  </div>
  <div>
    <label className="checkbox-label">
      <input
        type="checkbox"
        name="checkbox3"
        checked={checkedState.checkbox3}
        onChange={handleCheckboxChange}
      />
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac ante non metus interdum sollicitudin. Quisque vitae semper sem, non convallis lacus.
    </label>
  </div>
</div>
      )}

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
          <button className={styles.button} disabled={isLoading || !stripe || !elements || !allChecked}>
            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
          </button>
        </>
      )}

      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}