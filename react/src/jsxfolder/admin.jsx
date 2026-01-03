import "../css/admin.css"

function Admin() {
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
            
            <div className="req-row">
                <span className="user-cell">
                  <span className="red-circle"></span>
                       John Doe
                     </span>
                <span>12345</span>
                <span>500</span>
                <span>12345678900</span>
               <div className="action-buttons">
                   <button className="btn reject">✕</button>
                    <button className="btn accept">✓</button>
                </div>
            </div>
          </div>
         </div>

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
            
            <div className="req-row">
                <span className="user-cell">
                  <span className="red-circle"></span>
                       John Doe
                     </span>
                <span>123</span>
                <span className="rejected1">
                <span className="rejected">✕ Rejected</span> 
                </span>
                <span>21/12/2000</span>
                <span>12:00 PM</span>

            </div>
          </div>
         </div>
        </div>
     <div className="left-row">
        <div className="stats-panel">
  <div className="stat-card">
    <div className="stat-inner">
      <p className="stat-title">TOTAL<br />REQUESTS</p>
      <h1 className="stat-number">453</h1>
    </div>
  </div>

  <div className="stat-card">
    <div className="stat-inner">
      <p className="stat-title">TOTAL<br />ACCEPTS</p>
      <h1 className="stat-number">408</h1>
    </div>
  </div>

  <div className="stat-card">
    <div className="stat-inner">
      <p className="stat-title">TOTAL<br />REJECTS</p>
      <h1 className="stat-number">45</h1>
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
