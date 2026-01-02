import "../css/orderc.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Profile from "./profile";
import { API_BASE_URL } from "../config";

function Order() {
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const userEmail = localStorage.getItem("gmail");
            if (!userEmail) {
                alert("Please login first");
                navigate("/login");
                return;
            }

            try {
                const url = `${API_BASE_URL}/auth/my-orders`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user: userEmail }),
                });
                const result = await response.json();
                if (result.success) {
                    setOrders(result.orders);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [navigate]);

    if (loading) return (
        <div className="oc-page-wrapper" style={{ justifyContent: 'center' }}>
            <h2>Loading Orders...</h2>
        </div>
    );

    return (
        <div className="oc-page-wrapper">
            <header className="oc-navbar">
                <div className="oc-nav-left">
                    <div className="oc-logo-circle">C</div>
                    <span className="oc-brand-name">Canteen Connect</span>
                </div>
                <div className="oc-profile-circle" onClick={() => setProfileOpen(true)}>
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="white">
                        <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" />
                        <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" />
                    </svg>
                </div>
                <Profile open={profileOpen} onClose={() => setProfileOpen(false)} />
            </header>

            <div className="oc-details-container" style={{ marginTop: '20px' }}>
                <h2 className="oc-section-title">My Orders</h2>

                {orders.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No active orders found.</p>
                ) : (
                    <div className="oc-items-list">
                        {orders.map((order) => (
                            <div key={order._id} style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#333' }}>Order #{order._id.slice(-6)}</span>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}
                                        style={{
                                            padding: '5px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                                            background: order.status === 'Ready' ? '#4CAF50' : '#FF9800', color: 'white'
                                        }}>
                                        {order.status}
                                    </span>
                                </div>
                                <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>Kitchen: {order.kitchen}</p>

                                {order.items.map((item, idx) => (
                                    <div className="oc-item-card" key={idx} style={{ padding: '10px', background: '#f9f9f9' }}>
                                        <img src={item.itemsrc} alt={item.itemname} className="oc-item-img" style={{ width: '50px', height: '50px' }} />
                                        <div className="oc-item-text">
                                            <div className="oc-item-name">
                                                <span>{item.itemname}</span>
                                                {item.quantity > 1 && <span className="oc-qty-badge">x{item.quantity}</span>}
                                            </div>
                                            <div className="oc-item-price">₹{item.itemprice * item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                                <div style={{ textAlign: 'right', marginTop: '10px', fontWeight: 'bold' }}>Total: ₹{order.totalAmount}</div>
                            </div>
                        ))}
                    </div>
                )}

                <button className="oc-home-btn" onClick={() => navigate("/menu")}>
                    Back to Menu
                </button>
            </div>
        </div>
    );
}

export default Order;