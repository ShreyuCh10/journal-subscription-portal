import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createInvoiceForSubscription } from "../../../Service/InvoiceApi";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Ensure each item has months
    const normalized = cart.map((item) => ({
      ...item,
      months: item.months || item.qty || 1,
    }));
    setCartItems(normalized);
    localStorage.setItem("cart", JSON.stringify(normalized));
  }, []);



const handleCheckout = async () => {
  try {
    const stored = localStorage.getItem("backendUser"); // or "user" or "authUser"
    if (!stored) {
      alert("User not logged in");
      return;
    }

    const backendUser = JSON.parse(stored);

    if (!backendUser || !backendUser.id) {
      alert("Invalid user data");
      return;
    }

    const userId = backendUser.id;

    const months = cartItems[0].months;
    const total = totalPrice;

    // 1️⃣ Create subscription
    const subRes = await createSubscription(userId, months);

    // 2️⃣ Create invoice
    const invoiceRes = await createInvoiceForSubscription(subRes.data.id, total);

    // 3️⃣ Pay invoice
    const paymentRes = await payInvoice(invoiceRes.data.id, "UPI");

    alert("Payment successful!");
  } catch (err) {
    console.error(err);
    alert("Checkout failed");
  }
};
  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const increaseMonths = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, months: item.months + 1 } : item
    );
    updateCart(updated);
  };

  const decreaseMonths = (id) => {
    const updated = cartItems
      .map((item) =>
        item.id === id ? { ...item, months: item.months - 1 } : item
      )
      .filter((item) => item.months > 0);
    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateCart(updated);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.months,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty 🛒</h2>
        <Link
          to="/dashboard/browse"
          className="text-blue-600 font-semibold hover:underline"
        >
          Browse Journals
        </Link>
      </div>
    );
  }

return (
  <div className="max-w-6xl mx-auto py-10">

    {/* Empty Cart */}
    {cartItems.length === 0 ? (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Your cart is empty 🛒
        </h2>
        <Link
          to="/dashboard/browse"
          className="text-indigo-600 font-medium hover:underline"
        >
          Browse Journals
        </Link>
      </div>
    ) : (
      <>
        <h1 className="text-3xl font-semibold text-gray-900 mb-10">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: Items */}
          <div className="lg:col-span-2 space-y-5">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex justify-between items-start gap-6">

                  {/* Info */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      ₹ {item.price} / month
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      ₹ {item.price * item.months}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="mt-6 flex justify-between items-center">

                  {/* Month Selector */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => decreaseMonths(item.id)}
                      className="px-4 py-2 hover:bg-gray-100 transition"
                    >
                      −
                    </button>
                    <span className="px-4 text-sm font-medium">
                      {item.months} month{item.months > 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => increaseMonths(item.id)}
                      className="px-4 py-2 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Summary */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm h-fit">

            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-gray-600">
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
              onClick={() => navigate("/dashboard/checkout")}
              className="mt-8 w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-black transition"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/dashboard/browse"
              className="block text-center mt-4 text-sm text-indigo-600 hover:underline"
            >
              Continue Browsing
            </Link>
          </div>
        </div>
      </>
    )}
  </div>
);
};

export default Cart;