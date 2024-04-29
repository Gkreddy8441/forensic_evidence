import React from 'react';
import { FaUser } from 'react-icons/fa'; // Import the FaUser icon from react-icons/fa
import '../Profile.css'; // Import the CSS file

const AdminProfile = ({ principal, name, dob, gender, specialization, isBlurred }) => {
  const profileClass = isBlurred ? 'profile-section ps blurred' : 'profile-section ps';

  return (
    <div className={profileClass}>
      <div className="tools">
      </div>
      <FaUser className="profile-pic" size="2rem" /> {/* Use the FaUser icon component */}
      <div className="profile-info">
        <p><b>Principal:</b> {principal}</p>
        <p><b>Name: </b>{name}</p>
        <p><b>Date of Birth:</b> {dob}</p>
        <p><b>Gender:</b> {gender}</p>
        <p><b>Mobile Number:</b> {specialization}</p>
      </div>
    </div>
  );
};

export default AdminProfile;