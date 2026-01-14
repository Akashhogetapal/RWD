import "../css/landing.css";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="header">
        <div className="header-inner">
          <div className="logo">Canteen Connect</div>

          <div className="nav">
            <button>Home</button>
            <button onClick={() => navigate("/menu")}>Menu</button>
            <button>Contact</button>
          </div>

          <div className="auth">
            <button className="primary" onClick={() => navigate("/login")}>
              Student Login
            </button>
            <button onClick={() => navigate("/Shop/Login")} className="secondary">Shopkeeper</button>
          </div>
        </div>
      </header>

      <section className="landing-hero">
        <div className="hero-text">
          <h1>Campus Dining, Simplified.</h1>
          <p>Order Food From Your Phone And Skip The Queue</p>
          <button onClick={() => navigate("/menu")}>Order Now →</button>
        </div>

        <div className="hero-image">
          <img src="https://res.cloudinary.com/dvpz1tzam/image/upload/v1764267047/photo_2025-11-27_23-40-01_qnuydz.jpg" />
        </div>
      </section>

      <footer className="footer">
        <div className="footer-stats">
          <div className="stat">
            <h3>15k+</h3>
            <p>Orders</p>
          </div>
          <div className="stat">
            <h3>4</h3>
            <p>Canteens</p>
          </div>
          <div className="stat">
            <h3>5 min</h3>
            <p>Avg Wait</p>
          </div>
        </div>
        <p className="footer-copy">© 2025 Canteen Connect</p>
      </footer>
    </div>
  );
}

export default Landing;
