import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null); // State to store user profile data
  const [error, setError] = useState(""); // State to handle errors

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userID = localStorage.getItem('userID'); // Retrieve the user ID from localStorage
        console.log('User ID from localStorage:', userID);

        // Make the API call without the Authorization header
        const response = await axios.get(`http://localhost:5000/api/users/profile?userID=${userID}`);

        console.log('User Profile:', response.data);
        setUserProfile(response.data); // Set the fetched user data
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError("Failed to load profile information. Please try again later.");
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return (
      <div className="container mt-5">
        <h2 className="mb-4">Profile Information</h2>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container mt-5">
        <h2 className="mb-4">Profile Information</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Profile Information</h2>

      <div className="card shadow p-4">
        <p><strong>Name:</strong> {userProfile.name}</p>
        <p><strong>Age:</strong> {userProfile.age}</p>
        <p><strong>Gender:</strong> {userProfile.gender}</p>
        <p><strong>Phone:</strong> {userProfile.phone}</p>
        <p><strong>Mother's Name:</strong> {userProfile.motherName}</p>
        <p><strong>Father's Name:</strong> {userProfile.fatherName}</p>
      </div>
    </div>
  );
};

export default Profile;
