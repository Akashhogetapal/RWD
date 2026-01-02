import "../css/admin.css"

function Admin() {
    return (
        <div className="cont">
            <header>
            <div className="admin-header">
                <h1>adm<span className="red-i">I</span>n dashboard</h1>
            </div>
            </header>
          
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

          </div>
         </div>





        </div>
    );
}
export default Admin;
