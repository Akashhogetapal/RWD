import "../css/orderc.css"; // Reuse some styles
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

function ShopDashboard() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("Pending");
    const kitchenName = localStorage.getItem("kitchenName");
    const shopUser = localStorage.getItem("shopUser");

    useEffect(() => {
        if (!kitchenName) navigate("/shop/login");
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/shop/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ kitchenName })
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (orderId, status) => {
        try {
            await fetch(`${API_BASE_URL}/auth/shop/update-status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status })
            });
            fetchOrders();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("shopToken");
        localStorage.removeItem("kitchenName");
        localStorage.removeItem("shopUser");
        navigate("/shop/login");
    };

    const filteredOrders = orders.filter(o => o.status === activeTab);

    // Calculate stats
    const todayRevenue = orders.reduce((acc, o) => acc + (o.status !== 'Rejected' ? o.totalAmount : 0), 0);
    const pendingCount = orders.filter(o => o.status === 'Pending').length;

    return (
        <div className="oc-page-wrapper" style={{ background: '#f5f7fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header className="oc-navbar" style={{ background: 'white', borderBottom: '1px solid #ddd', padding: '15px 30px' }}>
                <div className="oc-nav-left">
                    <span className="oc-brand-name" style={{ color: '#333' }}>{kitchenName} Portal</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span>Hello, {shopUser}</span>
                    <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#FF7043', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
                </div>
            </header>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', padding: '30px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#888', fontSize: '14px' }}>Total Revenue</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>₹{todayRevenue}</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#888', fontSize: '14px' }}>Pending Orders</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF7043' }}>{pendingCount}</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#888', fontSize: '14px' }}>Total Orders</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{orders.length}</p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ padding: '0 30px', display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {['Pending', 'Accepted', 'Preparing', 'Ready', 'Served', 'Rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setActiveTab(status)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '20px',
                            border: 'none',
                            background: activeTab === status ? '#FF7043' : 'white',
                            color: activeTab === status ? 'white' : '#666',
                            cursor: 'pointer',
                            fontWeight: '600',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                        }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Order List */}
            <div style={{ padding: '0 30px 30px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>No orders in {activeTab}</div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order._id} style={{ background: 'white', padding: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            <div>
                                <h4 style={{ margin: '0 0 10px 0' }}>Order #{order._id.slice(-6)}</h4>
                                <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>Wait time: {Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000)} mins ago</p>
                                <div style={{ marginTop: '10px' }}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                            <span style={{ fontWeight: 'bold' }}>{item.quantity}x</span>
                                            <span>{item.itemname}</span>
                                        </div>
                                    ))}
                                </div>
                                <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#333' }}>Total: ₹{order.totalAmount}</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {order.status === 'Pending' && (
                                    <>
                                        <button onClick={() => updateStatus(order._id, 'Accepted')} style={{ padding: '8px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Accept</button>
                                        <button onClick={() => updateStatus(order._id, 'Rejected')} style={{ padding: '8px 20px', background: '#EF5350', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Reject</button>
                                    </>
                                )}
                                {order.status === 'Accepted' && (
                                    <button onClick={() => updateStatus(order._id, 'Preparing')} style={{ padding: '8px 20px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Start Preparing</button>
                                )}
                                {order.status === 'Preparing' && (
                                    <button onClick={() => updateStatus(order._id, 'Ready')} style={{ padding: '8px 20px', background: '#FF9800', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Mark Ready</button>
                                )}
                                {order.status === 'Ready' && (
                                    <button onClick={() => updateStatus(order._id, 'Served')} style={{ padding: '8px 20px', background: '#9E9E9E', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Mark Served</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ShopDashboard;
