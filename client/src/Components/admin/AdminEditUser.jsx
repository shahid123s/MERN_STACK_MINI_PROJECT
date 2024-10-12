import axios from 'axios'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function AdminEditUser( ) {
    const [error, setError] = useState(null) 
    const [loading, setLoading] = useState(null) 
    const navigate = useNavigate()
    const location = useLocation();
    const { user } = location.state
    const [userData, setFormData] = useState({
        userName: user.userName,
        email: user.email,
        profileImage: null,
      });

    const { userName, email, profileImage } = userData;


    const updateUser = async (userId) => {
        const config = { headers:  {'Content-Type': 'multipart/form-data',} };
        try {
            const formData = new FormData();
            for (const key in userData) {
              formData.append(key, userData[key]);
            }
    
            const response = await axios.put(`http://localhost:5001/admin/edit-user-profile/${userId}`,formData, config);

            if(response){
                toast.success(response.data.message);
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error(error);
            setError(error.response.data.message)
        }
    }


    const onChange =(event) => {
        if(event.target.name === 'profileImages'){
            setFormData({ ...userData, profileImage: event.target.files[0] });
        }else {
            setFormData({ ...userData, [event.target.name]: event.target.value });
          }
    }

    const onSubmit = (event) => {
        event.preventDefault();
        updateUser(user._id)

    }



  return (
    <div className="edit-profile-container">
    <h2 className="form-title">Update Profile</h2>
    <h6 className='form-title'></h6>
    {error && <p className="error-message">{error}</p>}
    <form onSubmit={onSubmit} className="edit-profile-form">
      <div className="form-group">
        <label htmlFor="userName" className="form-label">
          Username:
        </label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={userName}
          onChange={onChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          required
          onChange={onChange}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="profileImages" className="form-label">
          Profile Image:
        </label>
        <input
          type="file"
          id="profileImages"
          name="profileImages"
          accept="image/*"
          onChange={onChange}
          className="form-input file-input"
        />
      </div>
      <button type="submit" disabled={loading} className="form-button">
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
      <button className='form-button' onClick={() => navigate('/admin/dashboard')}>Home</button>
    </form>
  </div>
  )
}

export default AdminEditUser
