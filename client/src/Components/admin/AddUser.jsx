import { useDispatch, useSelector } from 'react-redux'
import { register } from '../../store/slice/userSlice';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import './style/register.css'
import {toast} from 'react-toastify';

const AddUser = () => {
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    profileImage: null,
  });



  const { userName, email, password, profileImage } = formData;

  const onChange = (event) => {
    if (event.target.name === 'profileImages') {
      setFormData({ ...formData, profileImage: event.target.files[0] });
    } else {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }
    console.log(loading)
    console.log(formData)

  }

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(register(formData))
      .unwrap()
      .then(() => {
        toast.success('Registered Successfully')
        navigate('/admin/dashboard');

      })
      .catch((err) => {
        setError(err.message)
      })
  }

  return (
    <div className="register-container">
      <h2 className="register-title">Add New User</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={onSubmit} className="register-form">
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="userName"
            value={userName}
            onChange={onChange}
            required
            className="form-input-register"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="form-input-register"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            className="form-input-register"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Profile Image</label>
          <input
            type="file"
            name="profileImages"
            accept="image/*"
            onChange={onChange}
            className="form-input-register"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}

export default AddUser