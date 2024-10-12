const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoute = require('./Routes/userRoutes');
const dotenv = require('dotenv');
const connectMonogDB = require('./config/mongo');
const adminRoutes = require('./Routes/adminRoute');
dotenv.config();
const app = express()
const PORT = process.env.PORT;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : 'http://localhost:3000',
    credentials: true,               // Allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],   
}));
app.use('/uploads', express.static('uploads'));

app.use('/user' , userRoute);
app.use('/admin', adminRoutes)


app.listen(PORT, async() => {
    await connectMonogDB();
    console.log('Server listing on port ' + PORT)    
})
