import "./Dashboard.css";
import {
  FaHome,
  FaBookOpen,
  FaCreditCard,
  FaUser,
  FaCog,
  FaLifeRing,
} from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>JournalHub</h2>
        <ul>
          <li className="active"><FaHome /> Dashboard</li>
          <li><FaBookOpen /> Browse Journals</li>
          <li><FaBookOpen /> My Subscriptions</li>
          <li><FaCreditCard /> Payments</li>
          <li><FaUser /> Profile</li>
          <li><FaCog /> Settings</li>
          <li><FaLifeRing /> Support</li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="main-content">

        {/* Header */}
        <header className="header">
          <h1>User Dashboard</h1>
          <div className="header-right">
            <img src="https://i.pravatar.cc/40" alt="User" />
            <span>Welcome, User</span>
            <button className="logout-btn">Logout</button>
          </div>
        </header>

        {/* Page Content */}
        <main className="content">

          <div className="cards">
            <div className="card">
              <p>Active Subscriptions</p>
              <h3>5</h3>
            </div>

            <div className="card">
              <p>Journals Accessed</p>
              <h3>128</h3>
            </div>

            <div className="card">
              <p>Pending Payments</p>
              <h3>₹1,200</h3>
            </div>
          </div>

          <div className="activity">
            <h2>Recent Activity</h2>
            <ul>
              <li>Subscribed to International Science Journal</li>
              <li>Payment of ₹999 completed</li>
              <li>Downloaded Medical Research Paper</li>
            </ul>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
