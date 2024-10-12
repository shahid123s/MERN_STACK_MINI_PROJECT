const express = require('express');
const userRoute = express.Router();
const multer = require('multer');
const userController = require('../Controller/userController');
const path = require('path')
const auth = require('../Middleware/userAuth')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profileImages');
    },
    filename: (req, file , cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9 );
        cb(null, uniqueSuffix+path.extname(file.originalname));
    }
});

const uploads = multer({storage})


userRoute.post('/register', uploads.single('profileImage') ,userController.register );
userRoute.post('/login', userController.login);
userRoute.post('/logout', userController.logout);
userRoute.get('/profile/:userId',auth ,userController.loadProfile);
userRoute.put('/updateProfile/:userId', auth, uploads.single('profileImage'), userController.updateProfile);



module.exports = userRoute;