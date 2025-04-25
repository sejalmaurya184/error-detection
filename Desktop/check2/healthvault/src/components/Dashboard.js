import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleViewRecords = () => {
    navigate("/health-records");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    // Future: Clear auth tokens/session here
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Welcome, Ravi Mehta</h2>
          <p className="text-muted">Your personal health dashboard</p>
        </div>
        <button className="btn btn-success" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-4 mb-4">
          <div className="card text-center p-3 shadow">
            <h5 className="card-title">Health Records</h5>
            <p className="card-text">View and upload your health documents.</p>
            <button className="btn btn-primary" onClick={handleViewRecords}>
              Go to Records
            </button>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card text-center p-3 shadow">
            <h5 className="card-title">Profile</h5>
            <p className="card-text">View and update your profile information.</p>
            <button className="btn btn-primary" onClick={handleProfile}>
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
