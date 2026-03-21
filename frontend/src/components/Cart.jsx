import React from 'react';
import api from '../api/axiosConfig';

const Cart = ({ cart, onUpdateQuantity, onRemove, onCheckout, user }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to complete your purchase.");
      return;
    }

    const orderRequest = {
      items: cart.map(item => ({
        productId: item.type === 'product' ? item.id : null,
        customDesignId: item.type === 'custom' ? item.id : null,
        quantity: item.quantity
      }))
    };

    try {
      await api.post('/orders/checkout', orderRequest);
      alert("Order placed successfully!");
      onCheckout(); 
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to place order: " + (error.response?.data?.message || error.message));
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500">Go back to the shop to add some items!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-3xl font-black mb-8 border-b pb-4">Shopping Cart</h2>
      <div className="space-y-6">
        {cart.map((item) => (
          <div key={item.cartItemId} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-4">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg" onError={(e) => e.target.src = 'https://via.placeholder.com/80'} />
              <div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-blue-600 font-bold">${item.price.toFixed(2)}</p>
                {item.type === 'custom' && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">Custom Print</span>}
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center border rounded-lg">
                <button onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50" disabled={item.quantity <= 1}>-</button>
                <span className="px-4 font-semibold">{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
              </div>
              <button onClick={() => onRemove(item.cartItemId)} className="text-red-500 hover:text-red-700 font-medium">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex justify-between items-center p-6 bg-gray-50 rounded-xl">
        <div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Estimated Total</p>
          <p className="text-3xl font-black text-gray-900">${total.toFixed(2)}</p>
        </div>
        <button 
          onClick={handleCheckout}
          className="bg-black text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;