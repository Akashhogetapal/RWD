import "../css/admin.css";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

function Admin() {
  const [requests, setRequests] = useState([]);
  const [activity, setActivity] = useState([]);
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
      setActivity(list);

      setStats({
        total: list.length,
        accepted: list.filter(i => i.status === "ACCEPTED").length,
        rejected: list.filter(i => i.status === "REJECTED").length
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchActivity();
  }, []);

  // ================= ACTIONS =================
const handleAccept = async (req) => {
  const ukey = req.key;
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
};

  const handleReject = async (id) => {
    await fetch(`${API_BASE_URL}/auth/reject-topup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    fetchRequests();
    fetchActivity();
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
            <p className="incom-para">Incomiung Reaquests</p>
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
                  <span>{req.key}</span>
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
            <p className="incom-para">Reacent Activity</p>
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