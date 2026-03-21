import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('designs');
  const [designs, setDesigns] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stockQuantity: '', category: '', imageUrl: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'designs') {
        const res = await api.get('/custom-designs/all');
        setDesigns(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === 'products') {
        const res = await api.get('/products');
        setProducts(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === 'orders') {
        const res = await api.get('/orders/all');
        setOrders(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      if (activeTab === 'designs') setDesigns([]);
      if (activeTab === 'products') setProducts([]);
      if (activeTab === 'orders') setOrders([]);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/custom-designs/${id}/status`, null, { params: { status: newStatus } });
      setDesigns(designs.map(d => d.id === id ? { ...d, status: newStatus } : d));
    } catch (err) { alert("Update failed"); }
  };

  const handleOrderStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}/status`, null, { params: { status: newStatus } });
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (err) { alert("Update failed"); }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', newProduct);
      setNewProduct({ name: '', description: '', price: '', stockQuantity: '', category: '', imageUrl: '' });
      fetchData();
    } catch (err) { alert("Creation failed"); }
  };

  return (
    <div className="max-w-[95rem] mx-auto px-4 py-10">
      <h1 className="text-4xl font-black mb-8">Admin Console</h1>
      
      <div className="flex space-x-4 mb-8 border-b pb-4">
        {['designs', 'products', 'orders'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg font-bold uppercase tracking-wider transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 animate-pulse text-gray-500 font-bold">Loading {activeTab}...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {activeTab === 'designs' && (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Preview</th>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">User</th>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Status</th>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {Array.isArray(designs) && designs.map(d => (
                  <tr key={d.id}>
                    <td className="px-6 py-4">
                      <img src={`http://localhost:8080${d.designFileUrl}`} className="h-12 w-12 object-cover rounded" onError={e=>e.target.src='https://via.placeholder.com/50'} />
                    </td>
                    <td className="px-6 py-4 font-medium">User #{d.user?.id} ({d.user?.email})</td>
                    <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">{d.status}</span></td>
                    <td className="px-6 py-4 text-right">
                      <select onChange={(e) => handleStatusUpdate(d.id, e.target.value)} value={d.status} className="bg-black text-white px-3 py-1 rounded text-xs">
                        {['PENDING_REVIEW', 'APPROVED', 'IN_PRODUCTION', 'SHIPPED'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'products' && (
            <div className="p-8">
              <form onSubmit={handleCreateProduct} className="mb-10 grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border">
                <input placeholder="Name" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name: e.target.value})} className="p-2 border rounded" required />
                <input placeholder="Category" value={newProduct.category} onChange={e=>setNewProduct({...newProduct, category: e.target.value})} className="p-2 border rounded" required />
                <input placeholder="Price" type="number" step="0.01" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price: e.target.value})} className="p-2 border rounded" required />
                <input placeholder="Stock" type="number" value={newProduct.stockQuantity} onChange={e=>setNewProduct({...newProduct, stockQuantity: e.target.value})} className="p-2 border rounded" required />
                <input placeholder="Image URL" value={newProduct.imageUrl} onChange={e=>setNewProduct({...newProduct, imageUrl: e.target.value})} className="p-2 border rounded col-span-2" required />
                <textarea placeholder="Description" value={newProduct.description} onChange={e=>setNewProduct({...newProduct, description: e.target.value})} className="p-2 border rounded col-span-2" required />
                <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 col-span-2">Create Product</button>
              </form>
              <div className="grid grid-cols-4 gap-6">
                {Array.isArray(products) && products.map(p => (
                  <div key={p.id} className="border p-4 rounded-lg">
                    <img src={p.imageUrl} className="h-32 w-full object-cover mb-2 rounded" onError={e=>e.target.src='https://via.placeholder.com/150'} />
                    <h3 className="font-bold truncate">{p.name}</h3>
                    <p className="text-blue-600 font-bold">${p.price}</p>
                    <p className="text-xs text-gray-500">Stock: {p.stockQuantity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Order</th>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Items</th>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Total</th>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Status</th>
                  <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {Array.isArray(orders) && orders.map(o => (
                  <tr key={o.id}>
                    <td className="px-6 py-4">
                        <div className="font-bold">#ORD-{o.id}</div>
                        <div className="text-[10px] text-gray-400">{o.user?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-xs space-y-1">
                            {o.items?.map((item, idx) => (
                                <div key={idx}>
                                    • {item.product?.name || 'Custom Design'} (x{item.quantity})
                                </div>
                            ))}
                        </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-600">${o.totalAmount}</td>
                    <td className="px-6 py-4"><span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">{o.status}</span></td>
                    <td className="px-6 py-4 text-right">
                      <select onChange={(e) => handleOrderStatusUpdate(o.id, e.target.value)} value={o.status} className="bg-black text-white px-3 py-1 rounded text-xs">
                        {['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;