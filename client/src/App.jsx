import './App.css'
import Dashboard from './Components/user/Home'
import Login from './Components/user/Login'
import RegisterForm from './Components/user/Register'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import EditProfile from './Components/user/EditProfile'
import AdminLogin from './Components/admin/AdminLogin'
import AdminHome from './Components/admin/AdminHome'
import AdminDashboard from './Components/admin/AdminDashboard'
import { AdminAuth, AdminRequireAuth } from './Components/private/AdminAuth'
import { UserAuth, UserRequireAuth } from './Components/private/UserAuth'
import AdminEditUser from './Components/admin/AdminEditUser'
import { ToastContainer } from 'react-toastify'
import AddUser from './Components/admin/AddUser'


function App() {

  axios.defaults.baseURL = 'http://localhost:5001';
  axios.defaults.withCredentials = true; //it allow to send the cookies with it 
  return (
    <>
    <ToastContainer/>
      <Router>
        <Routes>
          <Route path='/'>
            <Route index element= {<Navigate to={'/login'} replace/>}  />
            <Route path='register' element={
              <UserRequireAuth>
                <RegisterForm />
              </UserRequireAuth>
              } />
            <Route path='login' element={
              <UserRequireAuth>
                <Login />
              </UserRequireAuth>
            } />
            <Route path='home' element={
              <UserAuth>
                <Dashboard />
              </UserAuth>
              } />
            <Route path='edit-profile' element={
              <UserAuth>
                <EditProfile />
              </UserAuth>
              } />
          </Route>

          <Route path='/admin' >
            <Route index element={<Navigate to={'/admin/login'}/>} /> 
            <Route path='login' element={
              <AdminRequireAuth>
                <AdminLogin /> 

              </AdminRequireAuth>
             } /> 
            <Route path='home' element={
              <AdminAuth>
                <AdminHome />
              </AdminAuth>
            } />

            <Route path='dashboard' element={
              <AdminAuth>
                <AdminDashboard />
              </AdminAuth>
            } />
            <Route path='edit-user-profile' element={
              <AdminAuth>
                <AdminEditUser/>
              </AdminAuth>
              } /> 
            
            <Route path='add-user' element={
              <AdminAuth>
                <AddUser/>
              </AdminAuth>
                }
              />
          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
