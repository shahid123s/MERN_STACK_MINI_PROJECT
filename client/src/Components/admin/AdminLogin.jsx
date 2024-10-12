import React, { useEffect , useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch , useSelector } from 'react-redux';
import { login } from '../../store/slice/adminSlice';
import './style/adminLogin.css'
import { toast } from 'react-toastify';


function AdminLogin() {
const navigate = useNavigate();
const dispatch = useDispatch()
const {error, loading, adminId} = useSelector( state => state.adminAuth)

const [formData, setFormData] = useState({
  email: '',
  password: '',
});

const { email, password } = formData;


const onChange = (event) =>{
  setFormData({ ...formData, [event.target.name]: event.target.value });
}

const onSubmit = (event) => {
  event.preventDefault();

  dispatch(login({email, password}))
  .unwrap()
  .then((res) => {
      console.log(res.message)
      toast.success(res.message)
      navigate('/admin/home')
    
  })
  .catch(err => console.log(err))
}

  return (
    <div className="login-container">

        <h2 className="login-title">Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={onSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={onChange}
              required
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={onChange}
              required
              className="form-input"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

    </div>  
  )
}

export default AdminLogin
