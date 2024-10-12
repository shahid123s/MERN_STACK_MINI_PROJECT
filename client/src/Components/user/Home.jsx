// frontend/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, setUser } from '../../store/slice/userSlice'; // Ensure correct import
import './style/home.css'
import { toast } from 'react-toastify';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {token, userInfo, loading} = useSelector((state) => state.auth);
  const userId = localStorage.getItem('userId'); // Retrieve userId correctly

  // Function to fetch user info



  useEffect(() => {

    if (!token) {
      navigate('/login');
    } else {
      dispatch(setUser(userId))
    }
  }, [token, navigate, userId]);

  const onLogout = () => {
    dispatch(logout()).then(() => {
      toast.success('Logout Successfully')
      navigate('/login');
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      {userInfo && (
        <div className="user-info">
          <img
            className="profile-image"
            src={`http://localhost:5001/${userInfo.profileImage}`}
            alt="Profile"
          />
          <p>
            <strong>Name: </strong> {userInfo.userName}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
        </div>
      )}
      <button className="dashboard-button" onClick={onLogout}>Logout</button>
      <button className="dashboard-button" onClick={(e) => { e.preventDefault(); navigate('/edit-profile' ,{state : {userInfo}}); }}>Update</button>
    </div>
  );
};

export default Dashboard;