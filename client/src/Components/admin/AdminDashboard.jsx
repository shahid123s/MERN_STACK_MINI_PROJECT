import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import './style/adminDashboard.css'

function AdminDashboard() {
  const [usersData, setUsersData] = useState([]);
  const [searchData, setSearchData] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  useEffect(() => {
    fetchUsersData();
  }, [])


  const handleChange = (event) => {
    setSearchData(event.target.value)
  }

  const handleSearch = (event) => {
    event.preventDefault();
    const fetchSearchData = async () => {
      const response = await axios.post('http://localhost:5001/admin/usersData',{searchData});
      setUsersData(response.data)
    }
    fetchSearchData()
  }

  const fetchUsersData = async () => {
    try {
      const response = await axios.get('http://localhost:5001/admin/usersData');
      setUsersData(response.data);
      setLoading(false)
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleAddNewUser = () => {
    navigate('/admin/add-user');
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/admin/delete-user/${id}`);
      fetchUsersData();
      toast.success('User Deleted Successfully')
    } catch (error) {
      toast.error(error.message, 'Error on deleting User')
    }
  }

  const onUpdate = (user) => {
    navigate('/admin/edit-user-profile', { state: { user } })
  }

  const onDelete = (id) => {
    toast.warning(
      <div>
        <p>Are You Sure Want to Delete The User</p>
        <button className='btn' onClick={() => handleDelete(id)} style={{ marginRight: '10px' }} >Yes</button>
        <button className='btn' onClick={toast.dismiss()}>No</button>

      </div>,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: true,
        draggable: false,
      }
    )
  }




  return (
    <>
      <div className='navbar'>
        <h1>Dashboard</h1>
        <div
          style={{
            display: 'flex',

          }}
        >
         <form action="" onSubmit={handleSearch} >
         <input className='form-input'
            type="search"
            name="search"
            id="search"
            onChange={handleChange}
            value={searchData}
            style={{
              width: '70%'
            }} />
          <button className='btn' onClick={handleSearch} style={{padding: '13px 6px'}}>Search</button>
         </form>
          <button className='btn' onClick={handleAddNewUser}>Add user</button>

        </div>
        <button
          className='btn dashboard-btn'
          onClick={() => navigate('/admin/home')}>HOME</button>
      </div>
      {!loading && (
        <div className="table-container">
          <table className="users-table" aria-label="Users Data Table">
            <thead>
              <tr>
                <th scope="col">Si.No</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Profile Image</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData.length <= 0? <h1>User Not Found</h1> :usersData.map((user, index) => (
                <tr key={user._id}>
                  <td data-label="Si.No">{index + 1}</td>
                  <td data-label="Name">{user.userName}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Profile Image">
                    <img
                      src={
                        user.profileImage
                          ? `http://localhost:5001/${user.profileImage}`
                          : '/default-profile.png'
                      }
                      alt={`${user.userName}'s profile`}
                      className="profile-image"
                    />
                  </td>
                  <td data-label="Actions">
                    <button
                      className="btn update-btn"
                      onClick={() => onUpdate(user)}
                    >
                      Update
                    </button>
                    <button
                      className="btn delete-btn"
                      onClick={() => onDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default AdminDashboard
