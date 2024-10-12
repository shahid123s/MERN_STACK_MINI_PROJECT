import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/userSlice';
import adminReducer from './slice/adminSlice'



const store = configureStore({
  reducer: {
    auth:
    authReducer,
    adminAuth : 
    adminReducer,
  },
});

export default store;