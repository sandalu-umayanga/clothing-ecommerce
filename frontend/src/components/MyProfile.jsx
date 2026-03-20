import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const MyProfile = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // We are hardcoding the dummy user ID (1) for now
  const userId = 1;

  useEffect(() => {
    const fetchMyDesigns = async () => {
      try {
        const response = await api.get(`/custom-designs/user/${userId}`);
        // Sort designs so the newest ones appear first
        const sortedDesigns = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setDesigns(sortedDesigns);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching designs:", err);
        setError("Failed to load your profile data.");
        setLoading(false);
      }
    };

    fetchMyDesigns();
  }, [userId]);

  // A helper function to color-code the status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending Review</span>;
      case 'APPROVED':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Approved</span>;
      case 'IN_PRODUCTION':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">In Production</span>;
      case 'SHIPPED':
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Shipped</span>;
      default:
        return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl font-semibold text-gray-500 animate-pulse">Loading your profile...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500 font-semibold">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Custom Designs</h2>
        <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-600">
          Total Designs: {designs.length}
        </div>
      </div>

      {designs.length === 0 ? (
        <div className="text-center bg-white rounded-xl shadow-sm p-12 border border-gray-100">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">No designs yet</h3>
          <p className="mt-1 text-gray-500">You haven't requested any custom clothing yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => (
            <div key={design.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
              {/* Image Header */}
              <div className="h-48 bg-gray-200 relative">
                {/* We append localhost:8080 here because our database saved a relative URL 
                  like '/api/files/designs/123.png'.
                */}
                <img 
                  src={`http://localhost:8080${design.designFileUrl}`} 
                  alt="Custom Design" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'; }}
                />
                <div className="absolute top-4 right-4">
                  {getStatusBadge(design.status)}
                </div>
              </div>
              
              {/* Details Body */}
              <div className="p-6 flex-1 flex flex-col">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Specifications</h4>
                <p className="text-gray-600 text-sm mb-4 flex-1">
                  {design.specifications}
                </p>
                <div className="text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100">
                  Requested on: {new Date(design.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProfile;