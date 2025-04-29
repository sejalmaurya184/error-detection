// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./auth.scss"; // optional: add custom styles here
// import { authService } from '../services/api';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';

// const Signup = () => {
//   const navigate = useNavigate();
//   const [userType, setUserType] = useState("");
//   const [formData, setFormData] = useState({
//     name: "",
//     age: "",
//     gender: "",
//     height: "",
//     weight: "",
//     phone: "",
//     motherName: "",
//     fatherName: "",
//     password: "",
//     email: "",
//     specialization: "",
//     licenseNumber: "",
//     clinicName: "",
//     experience: "",
//     location: "",
//     confirmPassword: ""
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleUserTypeChange = (e) => {
//     setUserType(e.target.value);
//   };

//   // Email validation function
//   const isValidEmail = (email) => {
//     // Basic email format validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return false;
//     }

//     // Check for valid email domains
//     const domain = email.split('@')[1];
//     const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
//     return validDomains.includes(domain.toLowerCase());
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/users/signup', {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password
//       });
      
//       console.log('Signup successful:', response.data);
//       alert(response.data.message);
//       navigate('/verify-email');
//     } catch (error) {
//       console.error('Signup error:', error.response?.data || error);
//       setError(error.response?.data?.message || 'Error during registration. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
//       <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
//         <h3 className="text-center mb-4 text-primary">Sign Up for HealthVault</h3>
//         {error && (
//           <div className="alert alert-danger" role="alert">
//             {error}
//           </div>
//         )}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="name" className="form-label">Name</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               className="form-control"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="email" className="form-label">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               className="form-control"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="password" className="form-label">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               className="form-control"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               className="form-control"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <button 
//             type="submit" 
//             className="btn btn-primary w-100"
//             disabled={loading}
//           >
//             {loading ? 'Signing up...' : 'Sign Up'}
//           </button>
//         </form>
//         <div className="text-center mt-3">
//           <span>Already have an account? </span>
//           <Link to="/login">Login</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(""); // New: patient or doctor
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    phone: "",
    motherName: "",
    fatherName: "",
    password: "",
    email: "",
    specialization: "",
    licenseNumber: "",
    clinicName: "",
    experience: "",
    location: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType: userType,
        age: userType === "Patient" ? formData.age : null,
        gender: userType === "Patient" ? formData.gender : null,
        height: userType === "Patient" ? formData.height : null,
        weight: userType === "Patient" ? formData.weight : null,
        phone: formData.phone,
        motherName: userType === "Patient" ? formData.motherName : null,
        fatherName: userType === "Patient" ? formData.fatherName : null,
        specialization: userType === "Doctor" ? formData.specialization : null,
        licenseNumber: userType === "Doctor" ? formData.licenseNumber : null,
        clinicName: userType === "Doctor" ? formData.clinicName : null,
        experience: userType === "Doctor" ? formData.experience : null,
        location: formData.location, 
      };

      const response = await axios.post("http://localhost:5000/api/users/signup", payload);

      console.log("Signup successful:", response.data);
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error);
      setError(error.response?.data?.message || "Error during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center align-items-center vh-300 bg-light">
        <div className="card shadow p-4 signup-card" style={{ width: "100%", maxWidth: "450px" }}>
          <h3 className="text-center mb-4 text-primary">Sign Up for HealthVault</h3>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Select User Type */}
            <div className="mb-3">
              <label htmlFor="userType" className="form-label">Sign up as:</label>
              <select
                id="userType"
                name="userType"
                className="form-control"
                value={userType}
                onChange={handleUserTypeChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
              </select>
            </div>

            {/* Common Fields */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {}
            <div className={`patient-fields ${userType === "Patient" ? "" : "d-none"}`}>
              <div className="mb-3">
                <label htmlFor="age" className="form-label">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  className="form-control"
                  value={formData.age}
                  onChange={handleChange}
                  required={userType === "Patient"}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  className="form-control"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="motherName" className="form-label">Mother's Name</label>
                <input
                  type="text"
                  id="motherName"
                  name="motherName"
                  className="form-control"
                  value={formData.motherName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="fatherName" className="form-label">Father's Name</label>
                <input
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  className="form-control"
                  value={formData.fatherName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {'userType == Doctor'}
            <div className={`doctor-fields ${userType === "Doctor" ? "" : "d-none"}`}>
              <div className="mb-3">
                <label htmlFor="specialization" className="form-label">Specialization</label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  className="form-control"
                  value={formData.specialization}
                  onChange={handleChange}
                  required={userType === "Doctor"}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="licenseNumber" className="form-label">License Number</label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  className="form-control"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required={userType === "Doctor"}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="clinicName" className="form-label">Clinic Name</label>
                <input
                  type="text"
                  id="clinicName"
                  name="clinicName"
                  className="form-control"
                  value={formData.clinicName}
                  onChange={handleChange}
                  required={userType === "Doctor"}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
