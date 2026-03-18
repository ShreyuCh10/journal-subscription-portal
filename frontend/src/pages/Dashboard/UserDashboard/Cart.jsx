import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Load cart
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const normalized = cart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
      years: item.years || 1,
    }));

    setCartItems(normalized);
    localStorage.setItem("cart", JSON.stringify(normalized));
  }, []);

  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  // Quantity controls
  const increaseQuantity = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const decreaseQuantity = (id) => {
    const updated = cartItems
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .map((item) => ({
        ...item,
        quantity: item.quantity < 1 ? 1 : item.quantity
      }));

    updateCart(updated);
  };

  // Year controls
  const increaseYears = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, years: item.years + 1 } : item
    );
    updateCart(updated);
  };

  const decreaseYears = (id) => {
    const updated = cartItems
      .map((item) =>
        item.id === id ? { ...item, years: item.years - 1 } : item
      )
      .map((item) => ({
        ...item,
        years: item.years < 1 ? 1 : item.years
      }));

    updateCart(updated);
  };

  // Remove item
  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateCart(updated);
  };

  // Total
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity * item.years,
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
      <h1 className="text-3xl font-semibold text-gray-900 mb-10">
        Your Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-5">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    ₹ {item.price} per journal / year
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    ₹ {item.price * item.quantity * item.years}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  {/* Quantity */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Quantity</p>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-4 text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Years */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Years</p>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => decreaseYears(item.id)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-4 text-sm font-medium">
                        {item.years}
                      </span>
                      <button
                        onClick={() => increaseYears(item.id)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

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

        {/* Summary */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm text-gray-600">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.title} × {item.quantity} ({item.years} years)
                </span>
                <span>
                  ₹ {item.price * item.quantity * item.years}
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
    </div>
  );
};

export default Cart;