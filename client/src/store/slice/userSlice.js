import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

//axios

axios.defaults.baseURL = 'http://localhost:5001'; 
axios.defaults.withCredentials = true; //it allow to send the cookies with it 



//Initial state
const initialState = {
    token : localStorage.getItem('accessToken') || null,
    isAuthenticate : null,
    loading : false,
    error : null, 
    userId : localStorage.getItem('userId') || null ,
    userInfo : JSON.parse(localStorage.getItem('userInfo') )|| null 
}

//Thunks 

export const register = createAsyncThunk( 
    'auth/register',
    async(userData , thunkAPI) => {
        const config =  { headers:  {'Content-Type': 'multipart/form-data',} };


        try {
            const formData = new FormData();
            for (const key in userData) {
              formData.append(key, userData[key]);
            }

            const  response = await axios.post('user/register', formData, config);
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
);

export const login = createAsyncThunk(
    'auth/login',
    async ({email, password} , thunkAPI) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        try {
            const body = JSON.stringify({ email, password });

            const response = await axios.post('user/login', body, config)
            localStorage.setItem('accessToken', response.data.token)
            // localStorage.setItem('userId', response.data.user._id)


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

export const setUser = createAsyncThunk('auth/setUser', async (userId, {rejectWithValue , getState}) => {
    try {
        const { auth } = getState();
        
        if (!auth.token) {
          return rejectWithValue({ message: 'No authentication token found' });
        }
  

        const response = await axios.get(`/user/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        return response.data;
      } catch (error) {

        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        } else {
          return rejectWithValue({ message: 'An unexpected error occurred.' });
        }
      }
})


  export const logout = createAsyncThunk(
    'auth/logout',
    async (_, thunkAPI) => {
        try {
            const response =await  axios.post('/user/logout');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userInfo')
            localStorage.removeItem('userId'); 
            return {}; 
        } catch (error) {
            return thunkAPI.rejectWithValue({ message: 'Logout failed' });
        }
    }
);




// Redux slice

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers: {
        // setUser: (state, action) => {
        //     state.userInfo = action.payload;
        // }
    },
    extraReducers : (builder) => {
        builder

        //Register action
        .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        })
        .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        })
        .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Registration failed'
        })

        //login action
        .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticate = true;
            state.token = action.payload.token;
            localStorage.setItem('accessToken', state.token);
            state.userInfo = action.payload.user; // Store user data in state
            state.userId = state.userInfo._id
            localStorage.setItem('userId', state.userId); // Store user as a JSON string
        })
        .addCase(login.rejected, (state, action) => {
            state.token = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = action.payload.message || 'Login failed';
          })

         //logout
         .addCase(logout.fulfilled, (state) => {
            state.token = null;
            localStorage.clear
            state.userId = null;
            state.userInfo = null;
            state.isAuthenticate = false;
            state.user = null; // Clear user data from state
        })
        .addCase(logout.rejected, (state, action) => {
            state.error = action.payload.message || 'Logout failed';
        })

        .addCase(setUser.fulfilled, (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
        })
        .addCase(setUser.rejected, (state, action) => {
            state.error = action.payload.message || 'Logout Failed'
        })
          
    }
})

export default authSlice.reducer;