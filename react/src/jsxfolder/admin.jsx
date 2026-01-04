import "../css/admin.css"
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

const fetchRequests = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/topup-history`);
    const data = await res.json();
    setRequests(data.data || []);
  } catch (err) {
    console.error(err);
  }
};
const fetchActivity = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/topup-history`);
    const data = await res.json();
    setActivity(data.data || []);

    const accepted = data.data.filter(d => d.status === "ACCEPTED").length;
    const rejected = data.data.filter(d => d.status === "REJECTED").length;

    setStats({
      total: data.data.length,
      accepted,
      rejected
    });
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchRequests();
  fetchActivity();
}, []);

const handleAccept = async (id) => {
  await fetch(`${API_BASE_URL}/admin/accept-topup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  fetchRequests();
  fetchActivity();
};

const handleReject = async (id) => {
  await fetch(`${API_BASE_URL}/admin/reject-topup`, {
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
      <button className="btn reject" onClick={() => handleReject(req._id)}>✕</button>
      <button className="btn accept" onClick={() => handleAccept(req._id)}>✓</button>
    </div>
            </div>
            ))}
          </div>
         </div>

         <div className="activity">
            <p className="incom-para">Reacent Activity</p>
          <div className="main-req-row">
            <div className="req-row" >
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
          <span className="donut-value">90.07</span>
        </div>
      </div>
    </div>
   </div>
</div>

        </div>
    );
}
export default Admin;
