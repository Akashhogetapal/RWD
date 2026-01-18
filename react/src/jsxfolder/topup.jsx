import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/topup.css";
import scanner from "../images/scanner.png";
import AuthPopup from "./AuthPopup";
import { API_BASE_URL } from "../config";

function Topup() {
  const navigate = useNavigate();
  const [utr, setUtr] = useState("");
  const [amount, setAmount] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [popup, setPopup] = useState(null);
  const fetchBalance = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/getwallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: localStorage.getItem("key") 
        })
      });

      const data = await res.json();
      console.log("Wallet data:", data);

      if (data.balance !== undefined) {
        setCurrentBalance(data.balance);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchBalance();
  }, []);

  const quickAdd = (value) => {
    setAmount(value);
  };
  const handlePay = () => {
    if (amount <= 0) {
      setPopup({
        title: "Invalid Amount",
        message: "Enter a valid amount.",
        icon: "⚠️"
      });
      return;
    }

    if (!utr || utr.length < 10) {
      setPopup({
        title: "Invalid UTR",
        message: "Please enter a valid UTR number.",
        icon: "⚠️"
      });
      return;
    }

    setPopup({
      title: "Confirm Top-Up",
      message: `Add ₹${amount} to wallet?`,
      icon: "💸",
      btnText: "Confirm",
      onConfirm: async () => {
        try {
  const body = {
    key: localStorage.getItem("key"), 
    amt: amount,
    utr: utr
  };

  console.log("Topup request body:", body);

  const res = await fetch(`${API_BASE_URL}/auth/topup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  console.log("Topup response:", data);

  if (data.success) {
    setPopup({
      title: "Success 🎉",
      message: "Top-up request submitted successfully.",
      icon: "✅",
      btnText: "OK",
      onConfirm: () => navigate("/cart")
    });
  } else {
    setPopup({
      title: "Failed",
      message: data.message || "Top-up failed.",
      icon: "❌"
    });
  }
} catch (err) {
  console.error(err);
  setPopup({
    title: "Error",
    message: "Server error. Try again later.",
    icon: "❌"
  });
}
      }
    });
  };

  return (
    <div className="topup-page">
      <h1 className="topup-title">Top-Up</h1>

      <div className="balance-card">
        <p>CURRENT BALANCE</p>
        <h2>₹ {currentBalance}</h2>
      </div>

      <div className="topup-row">
        <div className="quick-add">
          <p className="addw">Add To Wallet</p>
          <div className="amount-buttons">
            <button className="a200" onClick={() => quickAdd(200)}>200</button>
            <button className="a500" onClick={() => quickAdd(500)}>500</button>
            <button className="a750" onClick={() => quickAdd(750)}>750</button>
          </div>
        </div>

        <div className="custom-amount">
          <p className="amt-para">Enter Amount</p>
          <input
            type="number"
            placeholder="₹ ____"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="last-sec">
        <div className="scanner">
          <img src={scanner} alt="My scanner" />
        </div>
        <div className="column-sec">
          <div className="utr-wrapper">
            <p className="utr-title">ENTER UTR</p>
            <input
              type="text"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              maxLength={12}
              placeholder="–––– –––– ––––"
              className="utr-input"
            />
          </div>
          <div className="topup-submit-btn">
            <button className="pay-btn" onClick={handlePay}>Submit</button>
          </div>
        </div>
      </div>

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

export default Topup;