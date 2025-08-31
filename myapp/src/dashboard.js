import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './dashboard.css'; // Import the CSS file here

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState({}); // Stores user info fetched from backend
  const [editMode, setEditMode] = useState(false); // Whether currently editing user info
  const [formData, setFormData] = useState({}); // Form data for editing user information
  const navigate = useNavigate();

  // Fetch logged-in user details from backend when component mounts
  const fetchUserDetails = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Assuming userId stored in localStorage

    try {
      const response = await axios.get(`http://localhost:5000/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Handle inputs change while editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Save updated user details to backend
  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    try {
      await axios.put(`http://localhost:5000/user/${userId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setEditMode(false); // Exit edit mode
      fetchUserDetails(); // Refresh user data
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Delete user account and logout
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    try {
      await axios.delete(`http://localhost:5000/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate('/login'); // Redirect to login after delete
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Logout function clearing auth and redirecting
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard header */}
      <h1>Dashboard</h1>

      {/* Editable form or user details display */}
      {editMode ? (
        <div className="edit-form">
          {/* Editable fields */}
          <input
            type="text"
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleChange}
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleChange}
            placeholder="Last Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <textarea
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            placeholder="Address"
          ></textarea>

          {/* Update and Cancel buttons */}
          <button onClick={handleUpdate} className="update-button">Update</button>
          <button onClick={() => setEditMode(false)} className="cancel-button">Cancel</button>
        </div>
      ) : (
        <div className="user-details">
          {/* Non-editable user info display */}
          <p>First Name: {userDetails.first_name}</p>
          <p>Last Name: {userDetails.last_name}</p>
          <p>Email: {userDetails.email}</p>
          <p>Phone Number: {userDetails.phone_number}</p>
          <p>Address: {userDetails.address}</p>

          {/* Buttons to edit or delete user */}
          <button onClick={() => setEditMode(true)} className="edit-button">Edit</button>
          <button onClick={handleDelete} className="delete-button">Delete Account</button>
        </div>
      )}

      {/* Logout button always visible */}
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default Dashboard;
