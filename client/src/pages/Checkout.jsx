import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";


const stripePromise = loadStripe("pk_test_51N8Qw2JvQw2JvQw2JvQw2JvQw2JvQw2JvQw2JvQw2JvQw2JvQw2JvQw2JvQw2JvQw2JvQw2JvQw2JvQw2Jv00testkey");

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Example: 20.00 лв. = 2000 стотинки
    const amount = 2000;
    try {
      // 1. Get client secret from backend
      const res = await fetch("http://localhost:4242/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "bgn" })
      });
      const data = await res.json();
      if (!data.clientSecret) throw new Error("Грешка при създаване на плащане");

      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name }
        }
      });
      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1">Име на картодържателя</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="Име и фамилия"
          required
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-gray-700 dark:text-gray-200 mb-1">Данни за карта</label>
        <div className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Плащането е успешно!</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 mt-4"
        disabled={!stripe || loading}
      >
        {loading ? "Обработка..." : "Плати"}
      </button>
    </form>
  );
}

export default function Checkout() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Плащане</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-xl font-semibold mb-4">Плащане с карта</h2>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}
