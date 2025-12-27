import "../css/cart.css";
import { useState, useEffect } from "react";
import Profile from "./profile";
import { useNavigate } from "react-router-dom";

function Cart() {
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pickupMins, setPickupMins] = useState(15);

    const [orderType, setOrderType] = useState("asap");
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");


    const userEmail = localStorage.getItem("gmail");
    const userKey = localStorage.getItem("key");


    const itemTotal = cartItems.reduce((acc, item) => acc + (item.itemprice * item.quantity), 0);
    const fee = orderType === 'schedule' ? 5 : 10;
    const tax = Math.round(itemTotal * 0.05);
    const grandTotal = itemTotal + fee + tax;
    const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        if (!userEmail) {
            alert("Please log in to view your cart.");
            navigate("/login");
            return;
        }
        fetchCart();
    }, [userEmail, navigate]);


    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await fetch("https://rwd.up.railway.app/auth/returncart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: userEmail }),
            });
            const data = await res.json();
            if (res.ok && data.success) setCartItems(data.items || []);
            else setCartItems([]);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };


    const handleUpdate = (item, change) => {
        const newQty = item.quantity + change;
        if (newQty < 1) { handleDelete(item); return; }

        setCartItems(prev => prev.map(i => i._id === item._id ? { ...i, quantity: newQty } : i));

        const endpoint = change > 0 ? "add2cart" : "remove-quantity";
        const payload = change > 0
            ? { user: userEmail, itemname: item.itemname, itemprice: item.itemprice, itemsrc: item.itemsrc }
            : { user: userEmail, itemname: item.itemname };

        fetch(`https://rwd.up.railway.app/auth/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).catch(console.error);
    };


    const handleDelete = (item) => {
        setCartItems(prev => prev.filter(i => i._id !== item._id));
        fetch("https://rwd.up.railway.app/auth/delete-item", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: userEmail, itemname: item.itemname })
        }).catch(console.error);
    };


    const handlePay = async () => {
        if (!userKey) return alert("Missing user key. Please log in again.");

        const btn = document.querySelector('.cc-pay-confirm-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = "Processing...";
        btn.disabled = true;

        try {

            const res = await fetch("https://rwd.up.railway.app/auth/getwallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: userKey })
            });
            const data = await res.json();

            if (res.status === 400) throw new Error("Invalid Session");
            if (data.balance < grandTotal) {
                alert("Insufficient wallet balance!");
                btn.innerHTML = originalText;
                btn.disabled = false;
                return;
            }


            const payRes = await fetch("https://rwd.up.railway.app/auth/updatewallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: userKey, amount: -grandTotal, utr: Date.now() })
            });

            if (payRes.status === 200) {

                const orderPlaced = await placeOrder();
                if (orderPlaced) {
                    alert("Payment successful! Order placed.");

                    navigate(`/order?email=${encodeURIComponent(userEmail)}`);
                } else {
                    alert("Money deducted but order failed. Contact support.");
                }
            } else {
                alert("Payment failed.");
            }
        } catch (err) {
            console.error(err);
            alert("Server error.");
        } finally {
            if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
        }
    };

    const placeOrder = async () => {
        try {
            const res = await fetch("https://rwd.up.railway.app/auth/placeorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: userEmail,
                    items: cartItems,
                    totalItems: totalItemsCount,
                    totalAmount: grandTotal,
                    orderType: orderType,
                    scheduleTime: orderType === 'schedule' ? scheduleTime : null
                })
            });
            return res.ok;
        } catch (err) { return false; }
    };


    const VegIcon = () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="cc-veg-icon">
            <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#22C55E" />
            <circle cx="8" cy="8" r="4" fill="#22C55E" />
        </svg>
    );

    const BackArrow = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
        </svg>
    );

    const DeleteIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    );

    return (
        <div className="cc-page-wrapper">
            <div className="cc-header">
                <div className="cc-header-left">
                    <button className="cc-back-btn" onClick={() => navigate("/menu")}>
                        <BackArrow />
                    </button>
                    <h1 className="cc-page-title">My Cart ({cartItems.length} Items)</h1>
                </div>
                <div className="cc-profile-badge" onClick={() => setProfileOpen(true)} style={{ cursor: 'pointer' }}>
                    <svg width="24" height="24" viewBox="0 0 16 16" fill="white">
                            <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" />
                            <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" />
                        </svg>
                </div>
                <Profile open={profileOpen} onClose={() => setProfileOpen(false)} />
            </div>

            <div className="cc-main-grid">
                { }
                <div className="cc-left-section">
                    <div className="cc-items-container">
                        {loading ? <p>Loading...</p> : cartItems.length === 0 ? <p>Your cart is empty.</p> : cartItems.map(item => (
                            <div className="cc-item-card" key={item._id}>
                                <div className="cc-card-left">
                                    <img src={item.itemsrc} alt={item.itemname} className="cc-item-img" />
                                    <div className="cc-item-info">
                                        <div className="cc-name-row">
                                            <VegIcon />
                                            <h3>{item.itemname}</h3>
                                        </div>
                                        <p className="cc-item-source">From: Central Mess</p>
                                        <p className="cc-item-price">₹{item.itemprice}</p>
                                    </div>
                                </div>

                                <div className="cc-card-actions">
                                    <div className="cc-qty-pill">
                                        <button onClick={() => handleUpdate(item, -1)}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleUpdate(item, 1)}>+</button>
                                    </div>
                                    <button className="cc-del-btn" onClick={() => handleDelete(item)}>
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cc-schedule-panel">
                        <h3 className="cc-section-title">When do you want this?</h3>
                        <div className="cc-toggle-wrapper">
                            <button className={`cc-toggle-option ${orderType === 'asap' ? 'active' : ''}`} onClick={() => setOrderType('asap')}>
                                Order Now (ASAP)
                            </button>
                            <button className={`cc-toggle-option ${orderType === 'schedule' ? 'active' : ''}`} onClick={() => setOrderType('schedule')}>
                                Pre-Order (Schedule)
                            </button>
                        </div>

                        <div className="cc-schedule-body">
                            {orderType === 'schedule' ? (
                                <>
                                    <div className="cc-inputs-row">
                                        <div className="cc-input-group">
                                            <label>Select Date</label>
                                            <div className="cc-fake-input">
                                                <i className="fa-regular fa-calendar"></i>
                                                <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="cc-input-group">
                                            <label>Select Time</label>
                                            <div className="cc-fake-input">
                                                <i className="fa-regular fa-clock"></i>
                                                <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cc-info-msg">Order ready at <span className="cc-highlight">{scheduleTime || "--:--"}</span></div>
                                </>
                            ) : (
                    <div className="cc-asap-view">
                        <div className="cc-quick-chips">
                            {[10, 15, 20].map((min) => (
                            <span
                                 key={min}
                                 className={`cc-chip ${pickupMins === min ? "active" : ""}`}
                                 onClick={() => setPickupMins(min)}
                                 style={{ cursor: "pointer" }}
                             >
                              {min} Mins
                            </span>
                          ))}
                        </div>

                <div className="cc-info-msg">
                    Ready for pickup in{" "}
                    <span className="cc-highlight">{pickupMins} minutes</span>.
                 </div>
                 </div>
                            )}
                        </div>
                    </div>
                </div>

                { }
                <div className="cc-right-section">
                    <div className="cc-payment-card">
                        <h2 className="cc-pay-header">Payment Details</h2>
                        <div className="cc-bill-row"><span>Item Total</span><span className="cc-val">₹{itemTotal}</span></div>
                        <div className="cc-bill-row"><span>Convenience Fee</span><span className="cc-val">₹{fee}</span></div>
                        <div className="cc-bill-row"><span>Taxes</span><span className="cc-val">₹{tax}</span></div>
                        <div className="cc-divider"></div>
                        <div className="cc-bill-total"><span>Grand Total</span><span>₹{grandTotal}</span></div>

                        <div className="cc-payment-method">
                            <i className="fa-regular fa-credit-card"></i> <span>Paying via: UPI/Wallet</span>
                        </div>

                        <button className="cc-pay-confirm-btn" onClick={handlePay} disabled={cartItems.length === 0}>
                            Pay & Order • ₹{grandTotal} &rarr;
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Cart;