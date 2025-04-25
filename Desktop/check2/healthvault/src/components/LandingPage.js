import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';
import limage from './doctor-with-clipboard-hand-drawn-style.png'

const LandingPage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary fs-2" to="/">HealthVault</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto me-3">
              <li className="nav-item"><a className="nav-link" href="#features">Features</a></li>
              <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
            </ul>
            <div className="d-flex">
              <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-grow-1 d-flex align-items-center bg-light hero-section" style={{ paddingTop: '100px' }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <h1 className="display-3 fw-bold mb-4 animate-pop" style={{ color: '#03045E' }}>
                Your Health, <br /> Your Data, <br />
                <span style={{ color: 'darkblue' }}>One Vault</span>
              </h1>
              <p className="lead text-muted mb-4 fs-5">
                Manage medical records effortlessly. Secure. Shareable. Always accessible.
              </p>
              <Link to="/signup" className="btn btn-primary btn-lg me-3 shadow">Get Started</Link>
              <Link to="/login" className="btn btn-outline-dark btn-lg">Login</Link>
            </div>

            <div className="col-md-6 d-none d-md-block position-relative">
              <img
                src ={limage}
                alt="Medical Doodle"
                className="img-fluid floating doodle-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer mt-auto" style={{ background: 'linear-gradient(to right, #1e3c72, #2a5298)', color: '#f1f1f1' }}>
        <div className="container py-5">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h4 className="fw-bold text-white mb-3">HealthVault</h4>
              <p className="small" style={{ color: '#dddddd' }}>
                Your secure digital vault for medical records. Manage, access, and share your health data anywhere, anytime.
              </p>
            </div>
            <div className="col-md-4 mb-4">
              <h6 className="text-uppercase mb-3 text-white">Quick Links</h6>
              <ul className="list-unstyled">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/login" className="footer-link">Login</Link></li>
                <li><Link to="/signup" className="footer-link">Sign Up</Link></li>
                <li><a href="#features" className="footer-link">Features</a></li>
              </ul>
            </div>
            <div className="col-md-4 mb-4">
              <h6 className="text-uppercase mb-3 text-white">Contact</h6>
              <p className="small mb-1" style={{ color: '#dddddd' }}>📍 Mumbai, India</p>
              <p className="small mb-1" style={{ color: '#dddddd' }}>📧 support@healthvault.com</p>
              <p className="small" style={{ color: '#dddddd' }}>📞 +91 98765 43210</p>
            </div>
          </div>
          <div className="border-top pt-3 text-center small" style={{ color: '#cccccc' }}>
            &copy; {new Date().getFullYear()} <strong className="text-white">HealthVault</strong>. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
