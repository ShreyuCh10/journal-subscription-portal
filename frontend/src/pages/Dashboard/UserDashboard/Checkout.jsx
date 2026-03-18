import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../../Service/CheckoutApi";
import { getCurrentUser } from "../../../Service/UserApi";

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [backendUser, setBackendUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);

    // Fetch the logged-in user from backend
    getCurrentUser().then(res => {
      setBackendUser(res.data);
    }).catch(err => console.error("Failed to load user:", err));
  }, []);

 const totalPrice = cartItems.reduce(
   (sum, item) => sum + item.price * item.quantity * item.years,
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
    formData.street.trim() !== "" &&
    formData.city.trim() !== "" &&
    formData.state.trim() !== "" &&
    formData.pincode.trim() !== "" &&
    cartItems.length > 0 &&
    backendUser !== null;

  const handlePayment = async () => {
    if (!isFormValid) return;

    try {
      // 1️⃣ Create Razorpay order
      const orderResponse = await createRazorpayOrder({
       amount: totalPrice
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

              items: cartItems.map(item => ({
                journalId: item.id,
                quantity: item.quantity,
                years: item.years
              })),

              amount: totalPrice,

              fullName: formData.fullName,
              email: formData.email,
              mobile: formData.mobile,

              street: formData.street,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,

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
      <h1 className="text-3xl font-semibold text-gray-900 mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-8">

          {/* Billing Details */}
          <div className="bg-white border rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Billing Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={formData.street}
                onChange={handleChange}
                className="md:col-span-2 border rounded-xl px-4 py-3"
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3"
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border rounded-2xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Payment Method</h2>

            {["Card", "Net Banking"].map((method) => (
              <label
                key={method}
                className={`flex justify-between border rounded-xl px-4 py-3 mb-3 cursor-pointer ${
                  paymentMethod === method
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-200"
                }`}
              >
                <span>{method}</span>
                <input
                  type="radio"
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                />
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION - ORDER SUMMARY */}
        <div className="bg-white border rounded-2xl p-8 shadow-sm h-fit">

          <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

          <div className="space-y-4 text-sm text-gray-600">

            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.title} × {item.quantity} ({item.years} years)
                </span>
                <span>₹{item.price * item.quantity * item.years}</span>
              </div>
            ))}

          </div>

          <div className="border-t mt-6 pt-6 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹ {totalPrice}</span>
          </div>

          <button
            disabled={!isFormValid}
            onClick={handlePayment}
            className={`mt-8 w-full py-3 rounded-xl ${
              isFormValid
                ? "bg-gray-900 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Pay ₹ {totalPrice}
          </button>

          <p className="text-xs text-gray-400 mt-4 text-center">
            Secure payment powered by Razorpay
          </p>

        </div>
      </div>
    </div>
  );
};

export default Checkout;