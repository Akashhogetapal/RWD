import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../css/canteen.css";
import Profile from "./profile";
import AuthPopup from "./AuthPopup";
import { API_BASE_URL } from "../config";

function Canteen() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [popup, setPopup] = useState(null);

  const kitchenParam = searchParams.get("kitchen") || searchParams.get("name");
  const gmailParam = searchParams.get("gmail") || searchParams.get("user");

  const dbCategory = kitchenParam;
  const displayName = kitchenParam;

  const kitchenImages = {
    "Main Course": "https://res.cloudinary.com/dxijfcgpw/image/upload/v1765875597/WhatsApp_Image_2025-12-15_at_21.23.13_86254f98_qe7fjr.jpg",
    "Quick Bites": "https://res.cloudinary.com/dxijfcgpw/image/upload/v1765875779/WhatsApp_Image_2025-12-15_at_21.30.24_dd9efbca_lzredk.jpg",
    "Beverages": "https://res.cloudinary.com/dxijfcgpw/image/upload/v1765875779/WhatsApp_Image_2025-12-15_at_21.30.24_dd9efbca_lzredk.jpg",
    "Sweet Tooth": "https://res.cloudinary.com/dxijfcgpw/image/upload/v1765875779/WhatsApp_Image_2025-12-15_at_21.30.24_dd9efbca_lzredk.jpg"
  };

  const heroImage = kitchenImages[dbCategory] || kitchenImages["Main Course"];

  useEffect(() => {
    if (gmailParam) localStorage.setItem("gmail", gmailParam);
  }, [gmailParam]);

  useEffect(() => {
    if (!dbCategory) return;

    async function fetchItems() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/auth/filter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: dbCategory })
        });

        if (!res.ok) throw new Error("Network error");
        const data = await res.json();

        if (Array.isArray(data)) setItems(data);
        else if (data.items) setItems(data.items);
        else setItems([]);

      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [dbCategory]);

  const add2cart = async (item) => {
    try {
      let userGmail = localStorage.getItem("gmail") || gmailParam;
      if (!userGmail) {
        setPopup({
          title: "Login Required",
          message: "Invalid User. Please Login first!",
          icon: "🔒",
          btnText: "Log In",
          onConfirm: () => navigate("/login")
        });
        return;
      }

      const res = await fetch(`${API_BASE_URL}/auth/add2cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userGmail,
          itemprice: item.price,
          itemsrc: item.imageUrl,
          itemname: item.name,
          kitchen: dbCategory 
        })
      });

      const data = await res.json();
      if (!data.success) {
        setPopup({
          title: "Error",
          message: data.message || "Failed to add item to cart.",
          icon: "❌",
          btnText: "Retry"
        });
        return;
      }
      setPopup({
        title: "Added to Cart 🛒",
        message: `${item.name} added successfully!`,
        icon: "✅",
        btnText: "Okay"
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!dbCategory) {
    return (
      <div className="canteen-page" style={{ padding: "20px", textAlign: "center", marginTop: "100px" }}>
        <div className="para">Please select a kitchen from the Menu</div>
        <button className="add-btn" onClick={() => navigate("/menu")} style={{ maxWidth: "200px" }}>Go to Menu</button>
      </div>
    );
  }

  return (
    <div className="canteen-page">

      { }
      <div className="canteen-header">
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
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.2998 5H22L20 12H8.37675M21 16H9L7 3H4M4 8H2M5 11H2M6 14H2" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="20" cy="20" r="1" />
            </svg>
          </div>
          <div className="profile-icon" onClick={() => setOpen(prev => !prev)}>
            <svg viewBox="0 0 16 16">
              <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" />
              <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" />
            </svg>
          </div>
          <Profile open={open}
            onClose={() => setOpen(false)}
          />
        </div>
      </div>

      { }
      <div className="canteen-hero" style={{ backgroundImage: `url(${heroImage})` }}>

        { }
        <button className="trial-btn" onClick={() => navigate("/menu")}>
          <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19L5 12L12 5" />
          </svg>
        </button>

        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">{displayName}</h1>
            <p className="hero-subtitle">North Indian • South Indian • Lunch & Dinner</p>
            <div className="hero-info">
              <button className="open-btn">Open Now</button>
              <span className="rating">⭐ 4.5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="para">{displayName} Specials</div>

      {loading ? (
        <div className="para" style={{ fontSize: '1.2rem', fontWeight: '400' }}>Loading dishes...</div>
      ) : (
        <div className="dish">
          {items.length > 0 ? (
            items.map((item) => (
              <div className="canteen-card" key={item._id}>
                <div className="image">
                  <img src={item.imageUrl || "https://via.placeholder.com/250"} alt={item.name} />
                </div>
                <div className="card-body">
                  <h4 className="dish-name">{item.name}</h4>
                  <p className="paisa">₹{item.price}</p>
                  <button className="add-btn" onClick={() => add2cart(item)}>Add +</button>
                </div>
              </div>
            ))
          ) : (
            <div className="para" style={{ gridColumn: '1 / -1', color: '#666' }}>No items found for {displayName}.</div>
          )}
        </div>
      )}

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

export default Canteen;