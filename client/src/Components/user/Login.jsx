import React, { useState } from 'react'
import {useNavigate, Link} from 'react-router-dom'
import { useDispatch , useSelector} from 'react-redux'
import { login } from '../../store/slice/userSlice';
import './style/login.css'
import { toast } from 'react-toastify';

function Login () {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {loading,  userId, userInfo} = useSelector((state) => state.auth)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
      });
    
      const { email, password } = formData;
    
      const onChange = (event) =>{
        setFormData({ ...formData, [event.target.name]: event.target.value });
      }


      

      const onSubmit = async (event) => {
        event.preventDefault();

        dispatch(login({email, password}))
        .unwrap()
        .then((res) => {
          toast.success(res.message)
          navigate('/home');
        })
        .catch(err => setError(err.message) )
      };
    
      return (
    <div className="login-container" style={{minHeight : '40vh'}}>
      <h2 className="login-title">Login</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={onSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <br />
        <Link to='/register' >Register Here.</Link>
      </form>
    </div>
      );
}

export default Login
