const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    userName: { 
        type: String, 
        required: true, 
        trim: true,
        unique: false,
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    profileImage: { 
        type: String 
      
    }
}, {timestamps: true}) // give two information about created and edited time 

module.exports = mongoose.model('User', UserSchema);