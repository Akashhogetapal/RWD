import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/shopdashboardd.css";
import { API_BASE_URL } from "../config";

function ShopDashboardd() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("Incoming");
    const [stats, setStats] = useState({
        totalOrders: 0,
        preparing: 0,
        revenue: 0
    });

    const [kitchenName, setKitchenName] = useState(localStorage.getItem("kitchenName") || "Snack Corner");
    const [shopUser, setShopUser] = useState(localStorage.getItem("shopUser") || "Shop Owner");

    useEffect(() => {
        if (!localStorage.getItem("kitchenName")) {
        }
    }, []);
    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/shop/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ kitchenName: kitchenName })
            });
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders || []);
                calculateStats(data.orders || []);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const calculateStats = (orderList) => {
        const total = orderList.length;
        const prepareCount = orderList.filter(o => o.status === "Preparing").length;
        const rev = orderList
            .filter(o => o.status === "Served")
            .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

        setStats({
            totalOrders: total,
            preparing: prepareCount,
            revenue: rev
        });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusFromTab = (tab) => {
        switch (tab) {
            case "Incoming": return "Pending";
            case "Accepted": return "Accepted";
            case "Rejected": return "Rejected";
            case "Preparing": return "Preparing";
            case "Ready": return "Ready";
            case "Served": return "Served";
            default: return "Pending";
        }
    };

    const filteredOrders = orders.filter(o => o.status === getStatusFromTab(activeTab));

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/shop/update-status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                fetchOrders();
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const renderActionButtons = (order) => {
        const s = order.status;
        const id = order._id;

        if (s === "Pending") {
            return (
                <div className="butt">
                    <button className="acc" onClick={() => handleStatusUpdate(id, "Accepted")}>Accept</button>
                    <button className="decline" onClick={() => handleStatusUpdate(id, "Rejected")}>Reject</button>
                </div>
            );
        }
        if (s === "Accepted") {
            return (
                <div className="butt">
                    <button className="acc" onClick={() => handleStatusUpdate(id, "Preparing")}>Start Preparing</button>
                </div>
            );
        }
        if (s === "Preparing") {
            return (
                <div className="butt">
                    <button className="acc" onClick={() => handleStatusUpdate(id, "Ready")}>Mark Ready</button>
                </div>
            );
        }
        if (s === "Ready") {
            return (
                <div className="butt">
                    <button className="acc" onClick={() => handleStatusUpdate(id, "Served")}>Mark Served</button>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="shopdashboardd-page-wrapper">
            {/* Header */}
            <div className="header">
                <div className="logo" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <svg width="40px" height="40px" viewBox="0 0 1024 1024" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#FF7043" d="M768 704H256a254.688 254.688 0 0 1-64-8.416V928a32 32 0 0 0 32 32h576a32 32 0 0 0 32-32v-232.416A254.688 254.688 0 0 1 768 704z" />
                        <path fill="#FF7043" d="M792.928 193.248A287.68 287.68 0 0 1 800 256a286.4 286.4 0 0 1-53.888 167.328c13.984-31.648 21.888-66.56 21.888-103.328a256 256 0 0 0-512 0c0 36.768 7.904 71.68 21.888 103.328A286.4 286.4 0 0 1 224 256c0-21.568 2.56-42.528 7.072-62.752A256 256 0 0 0 256 704h512a256 256 0 0 0 24.928-510.752z" />
                        <path fill="white" d="M802.08 701.504l-3.04 0.416A261.056 261.056 0 0 1 768 704H256c-10.528 0-20.864-0.864-31.072-2.08l-3.04-0.416A256.64 256.64 0 0 1 192 695.808V736h640v-40.192a255.872 255.872 0 0 1-29.92 5.696z" />
                    </svg>
                </div>
                <div className="rows">
                    {/* logos removed as requested */}

                    <div className="paras">
                        <p className="snack">{kitchenName}</p>
                        <p className="shop">{shopUser}</p>
                    </div>

                    {/* profile icon removed as requested */}
                </div>
            </div>

            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                {["Incoming", "Accepted", "Preparing", "Ready", "Served", "Rejected"].map(tab => (
                    <p
                        key={tab}
                        className={`side-item ${activeTab === tab ? "active" : ""}`}
                        onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }}
                    >
                        {tab}
                    </p>
                ))}
            </div>

            {/* Body */}
            <div className="body">
                <div className="paras">
                    <p>{activeTab} orders</p>
                    <p className="real">Manage and track your orders in real time</p>
                </div>

                {/* Stats Boxes */}
                <div className="boxes">
                    <div className="box box1">
                        <div className="innerpara">
                            <p>Total Orders</p>
                            <p className="price">{stats.totalOrders}</p>
                        </div>
                        <div className="inner-logo">
                            {/* Reusing existing SVG */}
                            <svg width="40px" height="40px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path stroke="#ff7043" fillRule="evenodd" clipRule="evenodd" d="M5.51132 9.177L6.27532 18.177C6.34062 19.1879 7.16948 19.9803 8.18232 20H16.8253C17.8378 19.9798 18.6661 19.1875 18.7313 18.177L19.4953 9.177C19.5542 8.63047 19.3817 8.08424 19.0196 7.67066C18.6575 7.25708 18.1388 7.01389 17.5893 7H7.41732C6.8678 7.01389 6.34917 7.25708 5.98707 7.67066C5.62497 8.08424 5.45246 8.63047 5.51132 9.177Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path fill="#ff7043" d="M16.703 6.66154C16.5161 7.03118 16.6642 7.48236 17.0338 7.66929C17.4035 7.85621 17.8547 7.7081 18.0416 7.33846L16.703 6.66154ZM17.3515 5.71218L18.0095 5.35226V5.35226L17.3515 5.71218ZM16.2783 5L16.3543 4.25386C16.3291 4.25129 16.3037 4.25 16.2783 4.25V5ZM8.72831 5V4.25C8.70292 4.25 8.67755 4.25129 8.6523 4.25386L8.72831 5ZM7.65513 5.71218L6.99714 5.35226L6.99714 5.35226L7.65513 5.71218ZM6.96502 7.33846C7.15195 7.7081 7.60313 7.85621 7.97277 7.66929C8.34241 7.48236 8.49052 7.03118 8.3036 6.66154L6.96502 7.33846ZM10.7533 11C10.7533 10.5858 10.4175 10.25 10.0033 10.25C9.5891 10.25 9.25331 10.5858 9.25331 11H10.7533ZM10.0033 11.5H9.25331H10.0033ZM15.7533 11C15.7533 10.5858 15.4175 10.25 15.0033 10.25C14.5891 10.25 14.2533 10.5858 14.2533 11H15.7533ZM18.0416 7.33846C18.3586 6.71151 18.3466 5.96863 18.0095 5.35226L16.6935 6.0721C16.7935 6.25502 16.7971 6.47548 16.703 6.66154L18.0416 7.33846ZM18.0095 5.35226C17.6723 4.73588 17.0533 4.32507 16.3543 4.25386L16.2023 5.74614C16.4097 5.76727 16.5934 5.88919 16.6935 6.0721L18.0095 5.35226ZM16.2783 4.25H8.72831V5.75H16.2783V4.25ZM8.6523 4.25386C7.95335 4.32507 7.3343 4.73588 6.99714 5.35226L8.31313 6.0721C8.41318 5.88919 8.5969 5.76727 8.80432 5.74614L8.6523 4.25386ZM6.99714 5.35226C6.65998 5.96863 6.64797 6.71151 6.96502 7.33846L8.3036 6.66154C8.20951 6.47548 8.21307 6.25502 8.31313 6.0721L6.99714 5.35226ZM9.25331 11V11.5H10.7533V11H9.25331ZM9.25331 11.5C9.25331 13.2949 10.7084 14.75 12.5033 14.75V13.25C11.5368 13.25 10.7533 12.4665 10.7533 11.5H9.25331ZM12.5033 14.75C14.2982 14.75 15.7533 13.2949 15.7533 11.5H14.2533C14.2533 12.4665 13.4698 13.25 12.5033 13.25V14.75ZM15.7533 11.5V11H14.2533V11.5H15.7533Z" />
                            </svg>
                        </div>
                    </div>
                    <div className="box box2">
                        <div className="innerpara">
                            <p>Preparing</p>
                            <p className="price">{stats.preparing}</p>
                        </div>
                        <div className="inner-logo">
                            {/* Reusing existing SVG */}
                            <svg fill="#ff7043" height="40px" width="40px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.999 511.999" xmlSpace="preserve">
                                <g><g><path d="M494.864,212.207H17.136C7.794,212.207,0,220.142,0,229.484v21.78c0,22.944,17.258,42.788,39.953,46.16l137.104,20.347 v35.855c0,63.594,51.671,115.709,115.265,115.709h104.124c63.594,0,115.552-52.113,115.552-115.709V229.483 C512,220.142,504.206,212.207,494.864,212.207z M177.057,283.567L44.924,263.96c-6.241-0.927-11.091-6.384-11.091-12.695v-5.225 h143.225V283.567z M478.169,353.628h-0.001c0,44.939-36.781,81.876-81.719,81.876H292.324c-44.939,0-81.433-36.936-81.433-81.876 V303.44c0-0.186,0-0.371,0-0.557V246.04h267.278V353.628z" /></g></g>
                            </svg>
                        </div>
                    </div>
                    <div className="box box3">
                        <div className="innerpara">
                            <p>Revenue</p>
                            <p className="price">₹ {stats.revenue}</p>
                        </div>
                        <div className="inner-logo">
                            <svg fill="#ff7043" width="40px" height="40px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M136.948 908.811c5.657 0 10.24-4.583 10.24-10.24V610.755c0-5.657-4.583-10.24-10.24-10.24h-81.92a10.238 10.238 0 00-10.24 10.24v287.816c0 5.657 4.583 10.24 10.24 10.24h81.92zm0 40.96h-81.92c-28.278 0-51.2-22.922-51.2-51.2V610.755c0-28.278 22.922-51.2 51.2-51.2h81.92c28.278 0 51.2 22.922 51.2 51.2v287.816c0 28.278-22.922 51.2-51.2 51.2zm278.414-40.96c5.657 0 10.24-4.583 10.24-10.24V551.322c0-5.657-4.583-10.24-10.24-10.24h-81.92a10.238 10.238 0 00-10.24 10.24v347.249c0 5.657 4.583 10.24 10.24 10.24h81.92zm0 40.96h-81.92c-28.278 0-51.2-22.922-51.2-51.2V551.322c0-28.278 22.922-51.2 51.2-51.2h81.92c28.278 0 51.2 22.922 51.2 51.2v347.249c0 28.278-22.922 51.2-51.2 51.2zm278.414-40.342c5.657 0 10.24-4.583 10.24-10.24V492.497c0-5.651-4.588-10.24-10.24-10.24h-81.92c-5.652 0-10.24 4.589-10.24 10.24v406.692c0 5.657 4.583 10.24 10.24 10.24h81.92zm0 40.96h-81.92c-28.278 0-51.2-22.922-51.2-51.2V492.497c0-28.271 22.924-51.2 51.2-51.2h81.92c28.276 0 51.2 22.929 51.2 51.2v406.692c0 28.278-22.922 51.2-51.2 51.2zm278.414-40.958c5.657 0 10.24-4.583 10.24-10.24V441.299c0-5.657-4.583-10.24-10.24-10.24h-81.92a10.238 10.238 0 00-10.24 10.24v457.892c0 5.657 4.583 10.24 10.24 10.24h81.92zm0 40.96h-81.92c-28.278 0-51.2-22.922-51.2-51.2V441.299c0-28.278 22.922-51.2 51.2-51.2h81.92c28.278 0 51.2 22.922 51.2 51.2v457.892c0 28.278-22.922 51.2-51.2 51.2zm-6.205-841.902C677.379 271.088 355.268 367.011 19.245 387.336c-11.29.683-19.889 10.389-19.206 21.679s10.389 19.889 21.679 19.206c342.256-20.702 670.39-118.419 964.372-284.046 9.854-5.552 13.342-18.041 7.79-27.896s-18.041-13.342-27.896-7.79z" /><path d="M901.21 112.64l102.39.154c11.311.017 20.494-9.138 20.511-20.449s-9.138-20.494-20.449-20.511l-102.39-.154c-11.311-.017-20.494 9.138-20.511 20.449s9.138 20.494 20.449 20.511z" /><path d="M983.151 92.251l-.307 101.827c-.034 11.311 9.107 20.508 20.418 20.542s20.508-9.107 20.542-20.418l.307-101.827c.034-11.311-9.107-20.508-20.418-20.542s-20.508 9.107-20.542 20.418z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Orders Grid */}
                <div className="new-orders">
                    <p className="para-neworder">{activeTab} Orders ({filteredOrders.length})</p>
                    <div className="cards">
                        {filteredOrders.length === 0 && <p style={{ color: "white", padding: "20px" }}>No orders found.</p>}

                        {filteredOrders.map(order => (
                            <div className="card" key={order._id}>
                                <div className="card-head">
                                    <p>#{order._id.slice(-6).toUpperCase()}</p>
                                    <div className="row">
                                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="24" height="24" fill="white" />
                                            <circle cx="12" cy="12" r="9" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 6V12L16.5 16.5" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="tym">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                <div className="name">
                                    <svg fill="#808080" width="23px" height="23px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,11A5,5,0,1,0,7,6,5.006,5.006,0,0,0,12,11Zm0-8A3,3,0,1,1,9,6,3,3,0,0,1,12,3ZM3,22V18a5.006,5.006,0,0,1,5-5h8a5.006,5.006,0,0,1,5,5v4a1,1,0,0,1-2,0V18a3,3,0,0,0-3-3H8a3,3,0,0,0-3,3v4a1,1,0,0,1-2,0Z" /></svg>
                                    <p className="cust-name">{order.userName}</p>
                                </div>
                                <div className="order-items">
                                    <p className="para">Order Items:</p>
                                    {order.items.map((item, idx) => (
                                        <p key={idx} className="dish-nam">{item.quantity} x {item.itemname}</p>
                                    ))}
                                </div>
                                <div className="price">₹ {order.totalAmount}</div>

                                {renderActionButtons(order)}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ShopDashboardd;
