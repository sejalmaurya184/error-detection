import React from "react";

const Profile = () => {
  // Static profile details (can be made dynamic later)
  const userProfile = {
    name: "Ravi Mehta",
    age: 30,
    gender: "Male",
    height: "5'9\"",
    weight: "70 kg",
    phone: "9876543210",
    motherName: "Meena Mehta",
    fatherName: "Rajesh Mehta",
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Profile Information</h2>

      <div className="card shadow p-4">
        <p><strong>Name:</strong> {userProfile.name}</p>
        <p><strong>Age:</strong> {userProfile.age}</p>
        <p><strong>Gender:</strong> {userProfile.gender}</p>
        <p><strong>Height:</strong> {userProfile.height}</p>
        <p><strong>Weight:</strong> {userProfile.weight}</p>
        <p><strong>Phone:</strong> {userProfile.phone}</p>
        <p><strong>Mother's Name:</strong> {userProfile.motherName}</p>
        <p><strong>Father's Name:</strong> {userProfile.fatherName}</p>
      </div>
    </div>
  );
};

export default Profile;
