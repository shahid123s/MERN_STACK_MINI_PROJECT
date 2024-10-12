import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


axios.defaults.baseURL = 'http://localhost:5001' ;
axios.defaults.withCredentials = true;


const initialState = {
    token : localStorage.getItem('adminToken') || null,
    isAdmin : false,
    loading : false,
    error : null,
    adminId : localStorage.getItem('adminId') || null,
}


export const login = createAsyncThunk(
    'adminAuth/login',
    async ({email, password} , thunkAPI) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        try {
            const body = JSON.stringify({ email, password });

            const response = await axios.post('admin/login', body, config)
            localStorage.setItem('adminToken', response.data.token)

            return response.data;

            


        } catch (error) {
            // Check if error.response and error.response.data exist
            if (error.response && error.response.data) {
                return thunkAPI.rejectWithValue(error.response.data);
            } else {
                return thunkAPI.rejectWithValue({ message: 'An unexpected error occurred.' });
            }
        }
    }
)


export const logout = createAsyncThunk(
    'adminAuth/logout',
    async (_, thunkAPI) => {
        try {
            const response =await  axios.post('/user/logout');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminId'); // Clear user info from localStorage
            return {}; // Returning an empty object
        } catch (error) {
            return thunkAPI.rejectWithValue({ message: 'Logout failed' });
        }
    }
);



const adminSlice = createSlice({ 
    name: 'adminAuth',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdmin = true;
            state.token = action.payload.adminToken;
            localStorage.setItem('adminToken', state.token);
            state.adminId = action.payload.user._id; // Store user data in state
            localStorage.setItem('adminId', state.adminId);

        })
        .addCase(login.rejected, (state, action) => {
            state.token = null;
            state.isAdmin = false;
            state.loading = false;
            state.error = action.payload.message || 'Login failed';
          })
        .addCase(logout.fulfilled, (state, action) => {
            state.token = null;
            localStorage.clear
            state.adminId = null;
            state.isAdmin = false;

        })
        .addCase(logout.rejected, (state, action) => {
            state.error = action.payload.message || 'Logout failed';
        })

    }
})

export default adminSlice.reducer