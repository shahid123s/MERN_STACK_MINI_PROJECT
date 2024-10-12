const express = require('express');
const adminRoutes = express.Router();
const multer = require('multer');
const adminController = require('../Controller/adminController');
const path = require('path')
const auth = require('../Middleware/adminAuth')

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


adminRoutes.post('/login', adminController.adminLogin);
adminRoutes.get('/admin-profile/:userId', auth, adminController.loadAdminData);
adminRoutes.get('/usersData', auth, adminController.loadUsersData)
adminRoutes.post('/usersData', auth, adminController.searchUser)
adminRoutes.put('/edit-user-profile/:userId', auth,uploads.single('profileImage'), adminController.editUser)
adminRoutes.delete('/delete-user/:id',auth, adminController.deleteUser);

module.exports = adminRoutes;