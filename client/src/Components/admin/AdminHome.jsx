import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/slice/adminSlice';
import './style/adminHome.css'
import { toast } from 'react-toastify';
function AdminHome() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {token, adminId} = useSelector((state) => state.adminAuth);
    const [userData, setData] = useState({
        userName : '',
        email : '',
        profileImage: ''
    })
    const fetchAdminData = async (adminId) => {

        const response = await axios.get(`http://localhost:5001/admin/admin-profile/${adminId}` );
        setData(response.data)
    }
    useEffect(() => {
        fetchAdminData(adminId)
    },[])


    const handleLogout = () => {
        dispatch(logout()).then(() => {
            toast.success('Logout Successfully')
            navigate('/admin/login');
          });
    }


  return (
    <div className="admin-home-container">
    <header className="admin-header">
      <h2>Admin Home</h2>
      <div className="admin-actions">
        <button className="btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <button
          className="btn dashboard-btn"
          onClick={(e) => {
            e.preventDefault();
            navigate('/admin/dashboard');
          }}
        >
          Dashboard
        </button>
      </div>
    </header>

    {userData.userName && (
      <div className="admin-profile">
        <img
          src={`http://localhost:5001/${userData.profileImage}`}
          alt={`${userData.userName}'s profile`}
          className="profile-image"
        />
        <div className="profile-details">
          <p>
            <strong>Name:</strong> {userData.userName}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
        </div>
      </div>
    )}
  </div>
  )
}

export default AdminHome
