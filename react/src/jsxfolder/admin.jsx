import "../css/admin.css";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

function Admin() {
  const [requests, setRequests] = useState([]);
  const [activity, setActivity] = useState([]);
  const [allHistory, setAllHistory] = useState([]); // Store full history for stats
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    rejected: 0
  });

  // ================= FETCH REQUESTS =================
  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/topup-history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      console.log("Incoming Requests:", data);
      setRequests(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FETCH ACTIVITY =================
  const fetchActivity = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/recent-topup-history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      console.log("Recent Activity:", data);

      const list = data.data || [];
      setActivity(list); // Keep showing only recent 10 in the list

      // FETCH ALL HISTORY FOR STATS
      // Ideally backend should provide a /stats endpoint, but for now we fetch all
      // or we assume we need another endpoint. 
      // Let's create a quick loop or just use what we have if the user accepts it.
      // BUT user said "total accept total request... nothing is working".
      // So we MUST fetch all. Let's assume we can use the same endpoint but maybe without limit?
      // Or better, let's fetch from a new endpoint or modify the existing one.
      // Since I cannot modify backend endlessly without permission, I will try to fetch using a different call
      // OR I will just add a stats endpoint to backend now.

    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      // reusing history endpoint but maybe we need a dedicated stats one.
      // let's Assume I update backend to give me full list if I ask for it or a stats endpoint.
      // I'll add getTopupStats to backend controller next.
      const res = await fetch(`${API_BASE_URL}/auth/topup-stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchRequests();
    fetchActivity();
    fetchStats();
  }, []);

  // ================= ACTIONS =================
  const handleAccept = async (req) => {
    const ukey = req.userkey; // Changed from req.key
    const uamount = req.amt;
    const uutr = req.utr;

    console.log("Sending to backend:", {
      key: ukey,
      amt: uamount,
      utr: uutr
    });

    const res = await fetch(`${API_BASE_URL}/auth/accept-topup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: ukey,
        amt: uamount,
        utr: uutr,
        type: "accepted"
      })
    });

    const data = await res.json();
    console.log("Backend response:", data);

    fetchRequests();
    fetchActivity();
    fetchStats();
  };

  const handleReject = async (req) => {
    // We must send the same structure the backend expects:
    // { key, amount, type: "rejected", utr }

    // Note: backend uses 'amount' instead of 'amt' for rejection, 
    // but our object has 'amt'. We map it here.

    await fetch(`${API_BASE_URL}/auth/reject-topup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: req.userkey,    // was req.key
        amount: req.amt,     // backend expects 'amount'
        utr: req.utr,
        type: "rejected"
      })
    });
    fetchRequests();
    fetchActivity();
    fetchStats();
  };

  return (
    <div className="cont">
      <header>
        <div className="admin-header">
          <h1>adm<span className="red-i">I</span>n dashboard</h1>
        </div>
      </header>

      <div className="dashboard-body">
        <div className="req-act">

          {/* ================= INCOMING REQUESTS ================= */}
          <div className="req">
            <p className="incom-para">Incoming Requests</p>
            <div className="main-req-row">

              <div className="req-row">
                <span>USER</span>
                <span>KEY</span>
                <span>AMOUNT</span>
                <span>UTR</span>
                <span>ACTION</span>
              </div>

              {requests.map(req => (
                <div className="req-row" key={req._id}>
                  <span className="user-cell">
                    <span className="red-circle"></span>
                    {req.username || "User"}
                  </span>
                  <span>{req.userkey}</span>
                  <span>{req.amt}</span>
                  <span>{req.utr}</span>
                  <div className="action-buttons">
                    <button
                      className="btn reject"
                      onClick={() => handleReject(req)}
                    >✕</button>
                    <button
                      className="btn accept"
                      onClick={() => handleAccept(req)}
                    >✓</button>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* ================= RECENT ACTIVITY ================= */}
          <div className="activity">
            <p className="incom-para">Recent Activity</p>
            <div className="main-req-row">

              <div className="req-row">
                <span>USER</span>
                <span>AMOUNT</span>
                <span>STATUS</span>
                <span>DATE</span>
                <span>TIME</span>
              </div>

              {activity.map(act => (
                <div className="req-row" key={act._id}>
                  <span className="user-cell">
                    <span className="red-circle"></span>
                    {act.username || "User"}
                  </span>
                  <span>{act.amt}</span>
                  <span className="rejected1">
                    <span className={act.status === "ACCEPTED" ? "accepted" : "rejected"}>
                      {act.status === "ACCEPTED" ? "✓ Accepted" : "✕ Rejected"}
                    </span>
                  </span>
                  <span>{new Date(act.date).toLocaleDateString()}</span>
                  <span>{new Date(act.date).toLocaleTimeString()}</span>
                </div>
              ))}

            </div>
          </div>

        </div>

        {/* ================= LEFT STATS ================= */}
        <div className="left-row">
          <div className="stats-panel">

            <div className="stat-card">
              <div className="stat-inner">
                <p className="stat-title">TOTAL<br />REQUESTS</p>
                <h1 className="stat-number">{stats.total}</h1>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-inner">
                <p className="stat-title">TOTAL<br />ACCEPTS</p>
                <h1 className="stat-number">{stats.accepted}</h1>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-inner">
                <p className="stat-title">TOTAL<br />REJECTS</p>
                <h1 className="stat-number">{stats.rejected}</h1>
              </div>
            </div>

          </div>

          <div className="donut-wrapper">
            <div className="donut">
              <div className="donut-center">
                <span className="donut-value">
                  {stats.total ? ((stats.accepted / stats.total) * 100).toFixed(2) : 0}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Admin;