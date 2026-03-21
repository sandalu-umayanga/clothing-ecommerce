import React, { useState, useEffect } from 'react';
import ProductCatalog from './components/ProductCatalog';
import CustomDesignForm from './components/CustomDesignForm';
import MyProfile from './components/MyProfile';
import AuthPage from './components/AuthPage';
import AdminDashboard from './components/AdminDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Cart from './components/Cart';

function App() {
  const [currentView, setCurrentView] = useState('shop');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    if (userData.role === 'ADMIN') {
        setCurrentView('admin');
    } else {
        setCurrentView('shop');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('shop');
    setCart([]);
  };

  const addToCart = (item, type = 'product') => {
    setCart(prevCart => {
      // Create a unique key for the cart item based on type and id
      const cartItemId = `${type}-${item.id}`;
      const existing = prevCart.find(ci => ci.cartItemId === cartItemId);
      
      if (existing) {
        return prevCart.map(ci => ci.cartItemId === cartItemId ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }

      // Format for the cart
      const newCartItem = {
        cartItemId,
        id: item.id,
        type,
        name: type === 'product' ? item.name : 'Custom Printed Apparel',
        price: type === 'product' ? item.price : 45.00,
        imageUrl: type === 'product' ? item.imageUrl : `http://localhost:8080${item.designFileUrl}`,
        quantity: 1
      };

      return [...prevCart, newCartItem];
    });
  };

  const updateQuantity = (cartItemId, quantity) => {
    setCart(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity } : item));
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const handleCheckoutSuccess = () => {
    setCart([]);
    setCurrentView('profile');
  };

  const renderView = () => {
    if (currentView === 'auth') return <AuthPage onAuthSuccess= {handleAuthSuccess} />;
    
    switch (currentView) {
      case 'shop': return <ProductCatalog onAddToCart={(p) => addToCart(p, 'product')} />;
      case 'cart': return <Cart cart={cart} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} onCheckout={handleCheckoutSuccess} user={user} />;
      case 'custom': return user ? <CustomDesignForm user={user} /> : <AuthPage onAuthSuccess={handleAuthSuccess} />;
      case 'profile': return user ? <MyProfile user={user} onAddToCart={(d) => addToCart(d, 'custom')} /> : <AuthPage onAuthSuccess={handleAuthSuccess} />;
      case 'admin': 
        if (user && user.role === 'ADMIN') {
            return <AdminDashboard />;
        } else {
            return <div className="text-center py-20 font-bold text-red-500">Access Denied: Admin privileges required.</div>;
        }
      case 'analytics': 
        if (user && user.role === 'ADMIN') {
            return <AnalyticsDashboard />;
        } else {
            return <div className="text-center py-20 font-bold text-red-500">Access Denied: Admin privileges required.</div>;
        }
      default: return <ProductCatalog onAddToCart={(p) => addToCart(p, 'product')} />;
    }
  };

  const getNavStyle = (viewName) => {
      return `text-sm font-bold tracking-wide transition-colors ${currentView === viewName ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setCurrentView('shop')}>
              <span className="text-2xl font-black tracking-tighter text-blue-600">
                THREAD<span className="text-gray-900">WORKS</span>
              </span>
              <span className="text-xs font-mono ml-3 text-gray-400">V1.0</span>
            </div>
            
            <div className="flex space-x-8 items-center">
              <button onClick={() => setCurrentView('shop')} className={getNavStyle('shop')}>SHOP</button>
              
              {user && user.role === 'CUSTOMER' && (
                <button onClick={() => setCurrentView('custom')} className={getNavStyle('custom')}>CREATE CUSTOM</button>
              )}

              {user && user.role === 'ADMIN' && (
                  <div className="flex space-x-6">
                    <button onClick={() => setCurrentView('admin')} className={`${getNavStyle('admin')} border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg`}>
                        ADMIN CONSOLE
                    </button>
                    <button onClick={() => setCurrentView('analytics')} className={`${getNavStyle('analytics')} flex items-center`}>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                      ANALYTICS
                    </button>
                  </div>
              )}

              <div className="flex items-center space-x-6 border-l pl-6">
                <button onClick={() => setCurrentView('cart')} className="relative p-1 text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cart.reduce((s, i) => s + i.quantity, 0)}
                    </span>
                  )}
                </button>

                {user ? (
                  <div className="flex items-center space-x-4">
                      {user.role === 'CUSTOMER' && (
                          <button onClick={() => setCurrentView('profile')} title="My Profile" className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors ${currentView === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          </button>
                      )}
                      <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">
                          Logout
                      </button>
                  </div>
                ) : (
                  <button onClick={() => setCurrentView('auth')} className="bg-black text-white px-5 py-2 rounded-md text-sm font-bold hover:bg-gray-800 transition-colors">
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {renderView()}
      </main>
    </div>
  );
}

export default App;