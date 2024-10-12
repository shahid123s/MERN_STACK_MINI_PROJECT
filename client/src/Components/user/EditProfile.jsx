import {useLocation, useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import { useEffect, useState } from 'react';
import axios from 'axios';
import './style/editProfile.css'
import { toast } from 'react-toastify';

function EditProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const {userInfo} = location.state;
    const {loading, userId, token} = useSelector(state => state.auth)
    const [userData, setFormData] = useState({
        userName: userInfo?.userName || '',
        email: userInfo?.email || '',
        profileImage: null,
      });

    const [error, setError] = useState('')

      const updateUser = async (userId) => {
        const config = { headers:  {'Content-Type': 'multipart/form-data',} };
        try {
            const formData = new FormData();
            for (const key in userData) {
              formData.append(key, userData[key]);
            }
            const response = await axios.put(`http://localhost:5001/user/updateProfile/${userId}`, formData, config);
            
            if(response){
              toast.success(response.data.message)
              navigate('/home')
            }
            
        } catch (error) {
            console.log(error)
            setError(error.response.data.message);
        }
      }

    const { userName, email, profileImage } = userData;
   
    const onChange = (event) => {
        if(event.target.name === 'profileImages'){
            setFormData({ ...userData, profileImage: event.target.files[0] });
        }else {
            setFormData({ ...userData, [event.target.name]: event.target.value });
          }
    }
    const onSubmit = (event) => {
        event.preventDefault();
        updateUser(userId)
    }


  return (
    <div className="edit-profile-container">
    <h2 className="form-title">Update Profile</h2>
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
      <button className='form-button' onClick={() => navigate('/home')}>Home</button>
    </form>
  </div>
  )
}

export default EditProfile
