import React, { useState } from 'react';
import ProductCatalog from './components/ProductCatalog';
import CustomDesignForm from './components/CustomDesignForm';
import MyProfile from './components/MyProfile'; // Import the new component

function App() {
  const [currentView, setCurrentView] = useState('shop');

  // A simple router function
  const renderView = () => {
    switch (currentView) {
      case 'shop': return <ProductCatalog />;
      case 'custom': return <CustomDesignForm />;
      case 'profile': return <MyProfile />;
      default: return <ProductCatalog />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setCurrentView('shop')}>
              <span className="text-2xl font-black tracking-tighter text-blue-600">
                THREAD<span className="text-gray-900">WORKS</span>
              </span>
            </div>
            
            {/* Navigation Links */}
            <div className="flex space-x-8 items-center">
              <button onClick={() => setCurrentView('shop')} className={`text-sm font-bold tracking-wide transition-colors ${currentView === 'shop' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
                SHOP
              </button>
              <button onClick={() => setCurrentView('custom')} className={`text-sm font-bold tracking-wide transition-colors ${currentView === 'custom' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
                CREATE CUSTOM
              </button>
              
              {/* Profile Button / Avatar placeholder */}
              <button 
                onClick={() => setCurrentView('profile')} 
                className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors ${currentView === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                title="My Profile"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
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