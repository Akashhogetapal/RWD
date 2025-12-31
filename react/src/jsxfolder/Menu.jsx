import "../css/menu.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Profile from "./profile";
import AuthPopup from "./AuthPopup";

function Menu({ onProfile }) {
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [popup, setPopup] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const userEmail = localStorage.getItem("gmail");

    useEffect(() => {
        fetchItems("All");
        document.body.style.overflow = "auto";
    }, []);

    const fetchItems = async (category) => {
        try {
            const res = await fetch("https://rwd.up.railway.app/auth/filter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setItems(data.items);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        fetchItems(filter);
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === "") {
            fetchItems(activeFilter);
            return;
        }

        try {
            const res = await fetch("https://rwd.up.railway.app/auth/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setItems(data.items);
            }
        } catch (err) {
            console.error(err);
        }
    };


    const handleKitchenClick = (kitchenName) => {
        if (!userEmail) {
            setPopup({
                title: "Login Required",
                message: "Please login to view kitchen details.",
                icon: "🔒",
                btnText: "Log In",
                onConfirm: () => navigate("/login")
            });
            return;
        }






        navigate(`/kitchen?name=${encodeURIComponent(kitchenName)}&user=${encodeURIComponent(userEmail)}`);
    };

    const addToCart = async (item) => {
        if (!userEmail) {
            setPopup({
                title: "Login Required",
                message: "Invalid User. Please Login first!",
                icon: "🔒",
                btnText: "Log In",
                onConfirm: () => navigate("/login")
            });
            return;
        }

        try {
            const res = await fetch("https://rwd.up.railway.app/auth/add2cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user: userEmail,
                    itemprice: item.price,
                    itemsrc: item.imageUrl,
                    itemname: item.name,
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setPopup({
                    title: "Added to Cart 🛒",
                    message: `${item.name} added successfully!`,
                    icon: "✅",
                    btnText: "Okay"
                });
            } else {
                setPopup({
                    title: "Error",
                    message: "Failed to add item to cart.",
                    icon: "❌",
                    btnText: "Retry"
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="menu-page-wrapper">

            { }
            <div className="header">
                <div className="logo" onClick={() => navigate("/")}>
                    <svg width="54" height="54" viewBox="0 0 512 512">
                        <g>
                            <circle fill="#ffffff" cx="254.437" cy="255.997" r="176.556" />
                            <path fill="#ffffff" d="M467.995,79.439V272.66c20.08,0,36.356-16.277,36.356-36.356V115.796 C504.352,95.716,488.075,79.439,467.995,79.439z" />
                        </g>
                        <g>
                            <path fill="#FF7043" d="M254.437,71.791C152.864,71.791,70.228,154.427,70.228,256s82.636,184.209,184.209,184.209 S438.646,357.573,438.646,256S356.01,71.791,254.437,71.791z M254.437,424.912c-93.138,0-168.912-75.774-168.912-168.912 S161.299,87.088,254.437,87.088S423.349,162.862,423.349,256S347.576,424.912,254.437,424.912z" />
                            <path fill="#FF7043" d="M254.437,126.11c-71.622,0-129.891,58.269-129.891,129.891c0,39.816,17.948,76.904,49.241,101.755 l9.513-11.978c-27.618-21.933-43.457-54.655-43.457-89.777c0-63.187,51.406-114.594,114.594-114.594 s114.594,51.406,114.594,114.594s-51.407,114.593-114.594,114.593c-20.435,0-40.507-5.47-58.045-15.819l-7.774,13.175 c19.892,11.738,42.653,17.941,65.819,17.941c71.622,0,129.891-58.269,129.891-129.891S326.058,126.11,254.437,126.11z" />
                            <path fill="#FF7043" d="M75.637,142.575V79.439H60.34v63.136c0,11.323-5.435,18.969-14.873,21.549V79.439H30.17v84.684 c-9.437-2.58-14.874-10.226-14.874-21.548V79.439H0v63.136c0,19.963,11.841,34.137,30.169,37.195v245.32h15.297V179.77 C63.796,176.713,75.637,162.538,75.637,142.575z" />
                            <path fill="#FF7043" d="M467.995,71.791h-7.648v7.648v200.869v144.78h15.297V279.629 C496.273,275.998,512,257.958,512,236.304V115.796C512,91.531,492.26,71.791,467.995,71.791z M496.703,236.304 c0,13.183-8.93,24.318-21.06,27.674V88.122c12.129,3.356,21.06,14.491,21.06,27.674V236.304z" />
                        </g>
                    </svg>
                </div>

                <div className="title"><h1>Canteen Connect</h1></div>

                <div className="right">
                    <div className="cart" onClick={() => navigate("/cart")}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF7043" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7.2998 5H22L20 12H8.37675M21 16H9L7 3H4M4 8H2M5 11H2M6 14H2" />
                            <circle cx="9" cy="20" r="1" />
                            <circle cx="20" cy="20" r="1" />
                        </svg>
                    </div>

                    <div className="profile-icon" onClick={onProfile}>
                        <svg width="24" height="24" viewBox="0 0 16 16" fill="white">
                            <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" />
                            <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* <Profile
                       open={profileOpen}
                         onClose={() => setProfileOpen(false)}
                         /> */}
            <div className="head">
                <div className="search">
                    <input type="text" placeholder="Search for Biryani, Burger or Wrap..." value={searchQuery} onChange={handleSearch} />
                </div>

                <div className="filter">
                    {["All", "Quick Bites", "Main Course", "Sweet Tooth", "Beverages"].map(f => (
                        <div key={f} className={`fbox ${activeFilter === f ? "active" : ""}`} onClick={() => handleFilterClick(f)}>
                            {f}
                        </div>
                    ))}
                </div>
            </div>

            <div className="section-title"><h2>Featured Kitchens</h2></div>

            { }
            <div className="kitchen">
                <div className="kcard" onClick={() => handleKitchenClick("Central Mess")}>
                    <div className="cicon">
                        <svg fill="#FF7043" width="35" height="35" viewBox="0 0 24 24">
                            <path d="M14,1a1,1,0,0,0-1,1V7a4,4,0,0,0,3,3.858v2.354A2.5,2.5,0,0,0,14.5,15.5v5a2.5,2.5,0,0,0,5,0v-5A2.5,2.5,0,0,0,18,13.212V10.858A4,4,0,0,0,21,7V2a1,1,0,0,0-2,0V6H18V2a1,1,0,0,0-2,0V6H15V2A1,1,0,0,0,14,1Zm3.5,19.5a.5.5,0,0,1-1,0v-5a.5.5,0,0,1,1,0ZM18.731,8a2,2,0,0,1-3.462,0ZM11,6c0-2.757-1.794-5-4-5S3,3.243,3,6a4.92,4.92,0,0,0,3,4.822v2.39A2.5,2.5,0,0,0,4.5,15.5v5a2.5,2.5,0,0,0,5,0v-5A2.5,2.5,0,0,0,8,13.212v-2.39A4.92,4.92,0,0,0,11,6ZM5,6c0-1.626.916-3,2-3S9,4.374,9,6,8.084,9,7,9,5,7.626,5,6ZM7.5,20.5a.5.5,0,0,1-1,0v-5a.5.5,0,0,1,1,0Z" />
                        </svg>
                    </div>
                    <div className="cinfo">
                        <h3>Central Mess</h3>
                        <p>Traditional Indian</p>
                    </div>
                </div>
                <div className="kcard" onClick={() => handleKitchenClick("Snack Corner")}>
                    <div className="cicon">
                        <svg fill="#FF7043" width="35" height="35" viewBox="0 0 50 50">
                            <path d="M33.3125 0C33.117188 0.0234375 32.9375 0.0820313 32.75 0.15625L7.34375 10.46875C6.703125 10.726563 6.246094 11.285156 6.125 11.96875L2.03125 35.25C1.917969 35.894531 2.128906 36.539063 2.59375 37L15.09375 49.40625C15.910156 50.21875 17.269531 50.179688 18.03125 49.3125L47.5 15.75C48.195313 14.960938 48.148438 13.738281 47.40625 13L34.9375 0.59375C34.652344 0.308594 34.289063 0.109375 33.90625 0.03125C33.714844 -0.0078125 33.507813 -0.0234375 33.3125 0 Z M 34.28125 2.75L37.46875 5.90625C36.789063 7.382813 36.828125 8.691406 36.34375 9.3125C35.949219 9.820313 35.03125 10.15625 34 10.84375C31.96875 12.195313 31.046875 14.25 29.6875 15.3125C28.175781 16.496094 25.625 16.839844 23.625 18.65625C21.953125 20.175781 21.308594 22.082031 20.6875 23.78125C20.066406 25.480469 19.492188 26.945313 18.21875 28.03125C17.378906 28.746094 15.753906 29.328125 14.4375 30.34375C12.765625 31.636719 12.007813 33.539063 11.46875 35.15625C11.199219 35.964844 10.976563 36.722656 10.78125 37.28125C10.585938 37.839844 10.367188 38.195313 10.375 38.1875C9.9375 38.570313 8.964844 38.8125 8.09375 39.65625L4.75 36.34375 Z M 31.5625 2.78125L4.3125 33.84375L8.09375 12.3125 Z" />
                        </svg>
                    </div>
                    <div className="cinfo">
                        <h3>Snack Corner</h3>
                        <p>Quick Bites & Snacks</p>
                    </div>
                </div>
                <div className="kcard" onClick={() => handleKitchenClick("Cafe Delight")}>
                    <div className="cicon">
                        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#FF7043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 20H10.9433M10.9433 20H11.0567M10.9433 20C10.9622 20.0002 10.9811 20.0002 11 20.0002C11.0189 20.0002 11.0378 20.0002 11.0567 20M10.9433 20C7.1034 19.9695 4 16.8468 4 12.9998V8.92285C4 8.41305 4.41305 8 4.92285 8H17.0767C17.5865 8 18 8.41305 18 8.92285V9M11.0567 20H18M11.0567 20C14.8966 19.9695 18 16.8468 18 12.9998M18 9H19.5C20.8807 9 22 10.1193 22 11.5C22 12.8807 20.8807 14 19.5 14H18V12.9998M18 9V12.9998M15 3L14 5M12 3L11 5M9 3L8 5" />
                        </svg>
                    </div>
                    <div className="cinfo">
                        <h3>Cafe Delight</h3>
                        <p>Coffee & Deserts</p>
                    </div>
                </div>
                <div className="kcard" onClick={() => handleKitchenClick("Juice Bar")}>
                    <div className="cicon">
                        <svg width="35" height="35" viewBox="0 0 512 512" fill="#FF7043">
                            <path d="M83.9375 31C79.6383 31 76.1562 34.4821 76.1562 38.7812C76.1562 43.0804 79.6383 46.5625 83.9375 46.5625L150.844 46.5625L168.312 87.7188L133.562 87.7188C129.263 87.7188 125.781 91.2008 125.781 95.5L125.781 249.906C125.781 321.504 179.235 379.975 246.812 384.188L246.812 465.438L177.25 465.438C172.951 465.438 169.469 468.92 169.469 473.219C169.469 477.518 172.951 481 177.25 481L331.906 481C336.205 481 339.687 477.518 339.688 473.219C339.688 468.92 336.205 465.438 331.906 465.438L262.375 465.438L262.375 384.188C329.936 379.942 383.406 321.471 383.406 249.906L383.406 169.562C383.407 169.507 383.438 169.462 383.438 169.406C383.438 169.351 383.407 169.305 383.406 169.25L383.406 156.562C412.998 152.643 435.813 126.828 435.844 95.5625C435.844 95.5412 435.844 95.5213 435.844 95.5C435.844 61.5033 408.91 33.8437 375.594 33.8438C344.862 33.8438 319.645 57.3868 315.906 87.7188L185.219 87.7188L163.188 35.75C162.806 34.8491 162.234 34.1025 161.594 33.4375C161.474 33.3117 161.347 33.2113 161.219 33.0938C160.653 32.578 160.026 32.1388 159.344 31.8125C159.157 31.7228 158.976 31.6374 158.781 31.5625C157.892 31.2206 156.967 30.9993 156 31L83.9375 31ZM367.812 50.25L367.812 76.5312L349.531 58.25C354.876 54.2622 361.061 51.482 367.812 50.25ZM383.406 50.25C390.149 51.4811 396.347 54.2381 401.688 58.2188L383.406 76.5L383.406 50.25ZM338.75 69.5L356.969 87.7188L331.688 87.7188C332.79 81.0526 335.191 74.8564 338.75 69.5ZM412.438 69.5C416.007 74.8683 418.43 81.0655 419.531 87.75C413.748 87.7388 404.918 87.7226 394.188 87.7188L412.438 69.5ZM141.344 103.281C143.487 103.281 165.913 103.281 174.906 103.281L199.625 161.625L141.344 161.625L141.344 103.281ZM191.812 103.281C236.937 103.281 280.994 103.281 323.031 103.281C323.086 103.282 323.132 103.313 323.188 103.312L367.812 103.312L367.812 149.344L367.812 161.625L216.562 161.625L191.812 103.281ZM394.562 103.312L419.531 103.312C418.436 109.888 416.083 116.041 412.594 121.344L394.562 103.312ZM383.406 114.156L401.875 132.625C396.492 136.684 390.231 139.504 383.406 140.75L383.406 114.156ZM141.344 177.188L367.812 177.188L367.812 249.906C367.812 315.785 317.023 369.031 254.562 369.031C192.116 369.031 141.344 315.799 141.344 249.906L141.344 177.188ZM165.844 236.156C161.545 236.156 158.063 239.638 158.062 243.938C158.063 302.968 203.802 350.969 260.438 350.969C264.737 350.969 268.219 347.487 268.219 343.188C268.219 338.888 264.737 335.406 260.438 335.406C212.572 335.406 173.625 294.533 173.625 243.938C173.625 239.638 170.143 236.156 165.844 236.156Z" />
                        </svg>
                    </div>
                    <div className="cinfo">
                        <h3>Juice Bar</h3>
                        <p>Fresh Juices & Smoothies</p>
                    </div>
                </div>
            </div>

            <div className="section-title"><h2>Popular Dishes</h2></div>

            { }
            <div className="dish">
                {items.map(item => (
                    <div className="item" key={item._id}>
                        <div className="pitem">
                            <img src={item.imageUrl} alt={item.name} />
                        </div>
                        <div className="titem">
                            <div className="itemtext">
                                <h3>{item.name}</h3>
                                <p>{item.category}</p>
                            </div>
                            <div className="cart-row">
                                <div className="itemprice">
                                    <h5>₹{item.price}</h5>
                                </div>
                                <div className="bcart">
                                    <button
                                        className="add-btn"
                                        onClick={() => addToCart(item)}
                                    >
                                        Add +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Popup */}
            {popup && (
                <AuthPopup
                    title={popup.title}
                    message={popup.message}
                    icon={popup.icon}
                    btnText={popup.btnText || "OK"}
                    onConfirm={() => {
                        if (popup.onConfirm) popup.onConfirm();
                        setPopup(null);
                    }}
                />
            )}
        </div>
    );
}

export default Menu;