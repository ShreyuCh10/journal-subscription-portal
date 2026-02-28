import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { processCheckout } from "../../../Service/CheckoutApi";
import {createRazorpayOrder,verifyRazorpayPayment,} from "../../../Service/CheckoutApi";
const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.months,
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.mobile.trim() !== "" &&
    formData.address.trim() !== "" &&
    cartItems.length > 0;


const handlePayment = async () => {
  if (!isFormValid) return;

  try {
    const stored = localStorage.getItem("user");
    const backendUser = JSON.parse(stored);

    // 1️⃣ Create order from backend
    const orderResponse = await createRazorpayOrder({
      amount: totalPrice,
    });

    const { orderId, amount, key } = orderResponse.data;

    const options = {
      key,
      amount,
      currency: "INR",
      name: "Journal Hub",
      description: "Journal Subscription Payment",
      order_id: orderId,

      handler: async function (response) {
        try {
          const verifyResponse = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId: backendUser.id,
            journalId: cartItems[0].id,
            months: cartItems[0].months,
            amount: totalPrice,
            fullName: formData.fullName,
            email: formData.email,
            mobile: formData.mobile,
            address: formData.address,
            paymentMethod,
          });

          if (verifyResponse.data.status === "SUCCESS") {
            localStorage.removeItem("cart");
            navigate(`/dashboard/receipt/${verifyResponse.data.receiptId}`);
          } else {
            alert("Payment verification failed");
          }
        } catch (err) {
          console.error(err);
          alert("Verification failed");
        }
      },

      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.mobile,
      },

      theme: {
        color: "#111827",
      },

      // 🔥 IMPORTANT PART
      method: {
        upi: paymentMethod === "UPI",
        card: paymentMethod === "Card",
        netbanking: paymentMethod === "Net Banking",
      },

      config: {
        display: {
          blocks: {
            upi: {
              name: "Pay using UPI",
              instruments: [
                {
                  method: "upi"
                }
              ]
            },
            card: {
              name: "Pay using Card",
              instruments: [
                {
                  method: "card"
                }
              ]
            },
            netbanking: {
              name: "Pay using Net Banking",
              instruments: [
                {
                  method: "netbanking"
                }
              ]
            }
          },
          sequence: [paymentMethod.toLowerCase().replace(" ", "")],
          preferences: {
            show_default_blocks: false
          }
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    alert("Payment failed");
  }
};

  return (
    <div className="max-w-6xl mx-auto py-12">
      <h1 className="text-3xl font-semibold text-gray-900 mb-10">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">

          {/* Billing Details */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Billing Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="md:col-span-2 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Payment Method
            </h2>

            <div className="space-y-4">
              {[ "Card", "Net Banking"].map((method) => (
                <label
                  key={method}
                  className={`flex items-center justify-between border rounded-xl px-4 py-3 cursor-pointer transition ${
                    paymentMethod === method
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200"
                  }`}
                >
                  <span className="font-medium text-gray-700">
                    {method}
                  </span>
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="accent-indigo-600"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - SUMMARY */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 text-sm text-gray-600">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.title} × {item.months}
                </span>
                <span>
                  ₹ {item.price * item.months}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6 flex justify-between text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>₹ {totalPrice}</span>
          </div>

          <button
            disabled={!isFormValid}
            onClick={handlePayment}
            className={`mt-8 w-full py-3 rounded-xl font-medium transition ${
              isFormValid
                ? "bg-gray-900 text-white hover:bg-black"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Pay ₹ {totalPrice}
          </button>

          <p className="text-xs text-gray-400 mt-4 text-center">
            Secure payment powered by Journal Hub
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;