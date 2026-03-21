import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const MyProfile = ({ user: initialUser, onAddToCart }) => { 
  const [user, setUser] = useState(initialUser);
  const [designs, setDesigns] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('details');

  // Editing State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...initialUser });
  
  const [editingDesignId, setEditingDesignId] = useState(null);
  const [designEditData, setDesignEditData] = useState({ specifications: '', file: null });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [designsRes, ordersRes] = await Promise.all([
        api.get(`/custom-designs/user/${user.id}`),
        api.get('/orders/my-orders')
      ]);
      
      const designList = Array.isArray(designsRes.data) ? designsRes.data : [];
      const orderList = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      
      setDesigns(designList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setOrders(orderList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError("Failed to load your profile data.");
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/users/profile', editFormData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setIsEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  const handleDesignUpdate = async (e, designId) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('specifications', designEditData.specifications);
    if (designEditData.file) {
      formData.append('file', designEditData.file);
    }

    try {
      await api.put(`/custom-designs/${designId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEditingDesignId(null);
      fetchData();
      alert("Design updated successfully!");
    } catch (err) {
      alert("Failed to update design. Only PENDING_REVIEW designs can be edited.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.put(`/orders/${orderId}/status`, null, { params: { status: 'CANCELLED' } });
      fetchData();
      alert("Order cancelled successfully.");
    } catch (err) {
      alert("Failed to cancel order.");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
        PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
        APPROVED: 'bg-blue-100 text-blue-800',
        IN_PRODUCTION: 'bg-purple-100 text-purple-800',
        SHIPPED: 'bg-green-100 text-green-800',
        PENDING: 'bg-yellow-100 text-yellow-800',
        PAID: 'bg-blue-100 text-blue-800',
        DELIVERED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800'
    };
    return <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status.replace('_', ' ')}</span>;
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Profile</h2>
        </div>
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
            {['details', 'designs', 'orders'].map(s => (
                <button key={s} onClick={() => setActiveSection(s)} className={`px-4 py-2 rounded-lg font-bold text-sm transition capitalize ${activeSection === s ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>{s}</button>
            ))}
        </div>
      </div>

      {activeSection === 'details' && (
        <div className="max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-blue-600 px-8 py-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-black">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                    <div className="text-white">
                        <h3 className="text-xl font-bold">{user.firstName} {user.lastName}</h3>
                        <p className="text-blue-100 text-sm">{user.email}</p>
                    </div>
                </div>
                {!isEditingProfile && (
                    <button onClick={() => setIsEditingProfile(true)} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-bold transition">Edit Profile</button>
                )}
            </div>

            {isEditingProfile ? (
                <form onSubmit={handleProfileUpdate} className="p-8 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="First Name" value={editFormData.firstName} onChange={e=>setEditFormData({...editFormData, firstName:e.target.value})} className="p-2 border rounded" required />
                        <input placeholder="Last Name" value={editFormData.lastName} onChange={e=>setEditFormData({...editFormData, lastName:e.target.value})} className="p-2 border rounded" required />
                        <input placeholder="Phone" value={editFormData.phoneNumber} onChange={e=>setEditFormData({...editFormData, phoneNumber:e.target.value})} className="p-2 border rounded col-span-2" />
                        <input placeholder="Address" value={editFormData.address} onChange={e=>setEditFormData({...editFormData, address:e.target.value})} className="p-2 border rounded col-span-2" />
                        <input placeholder="City" value={editFormData.city} onChange={e=>setEditFormData({...editFormData, city:e.target.value})} className="p-2 border rounded" />
                        <input placeholder="Zip Code" value={editFormData.zipCode} onChange={e=>setEditFormData({...editFormData, zipCode:e.target.value})} className="p-2 border rounded" />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={() => setIsEditingProfile(false)} className="px-4 py-2 text-gray-500 font-bold">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Save Changes</button>
                    </div>
                </form>
            ) : (
                <div className="p-8 grid grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Information</h4>
                        <p className="text-sm font-semibold">{user.phoneNumber || 'No phone provided'}</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Shipping Address</h4>
                        <p className="text-sm font-semibold">{user.address || 'No address provided'}</p>
                        <p className="text-sm text-gray-600">{user.city} {user.zipCode}</p>
                    </div>
                </div>
            )}
        </div>
      )}

      {activeSection === 'designs' && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(designs) && designs.map((design) => (
            <div key={design.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
              <div className="h-48 bg-gray-200 relative">
                <img src={`http://localhost:8080${design.designFileUrl}`} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4">{getStatusBadge(design.status)}</div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                {editingDesignId === design.id ? (
                    <form onSubmit={(e) => handleDesignUpdate(e, design.id)} className="space-y-4">
                        <textarea 
                            value={designEditData.specifications} 
                            onChange={e=>setDesignEditData({...designEditData, specifications: e.target.value})}
                            className="w-full p-2 border rounded text-sm"
                            rows="3"
                        />
                        <input type="file" onChange={e=>setDesignEditData({...designEditData, file: e.target.files[0]})} className="text-xs" />
                        <div className="flex justify-end space-x-2">
                            <button type="button" onClick={()=>setEditingDesignId(null)} className="text-xs font-bold text-gray-500">Cancel</button>
                            <button type="submit" className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded">Update</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <p className="text-gray-600 text-sm mb-4 flex-1">{design.specifications}</p>
                        <div className="flex flex-col space-y-2">
                            {design.status === 'PENDING_REVIEW' && (
                                <button 
                                    onClick={() => { setEditingDesignId(design.id); setDesignEditData({ specifications: design.specifications, file: null }); }}
                                    className="text-xs font-bold text-blue-600 hover:underline text-left"
                                >
                                    Edit Design Specs
                                </button>
                            )}
                            {design.status === 'APPROVED' && (
                                <button 
                                    onClick={() => onAddToCart(design)}
                                    className="bg-black text-white py-2 rounded text-xs font-bold hover:bg-gray-800 transition"
                                >
                                    Add to Cart ($45.00)
                                </button>
                            )}
                        </div>
                    </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'orders' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Order ID</th>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Total</th>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Status</th>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {Array.isArray(orders) && orders.map(o => (
                        <tr key={o.id}>
                            <td className="px-6 py-4 font-bold">#ORD-{o.id}</td>
                            <td className="px-6 py-4 font-bold text-blue-600">${o.totalAmount}</td>
                            <td className="px-6 py-4">{getStatusBadge(o.status)}</td>
                            <td className="px-6 py-4 text-right">
                                {o.status === 'PENDING' && (
                                    <button onClick={() => handleCancelOrder(o.id)} className="text-xs font-bold text-red-500 hover:underline">Cancel Order</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

export default MyProfile;