const User = require('../Model/UserModel');
const {hashPassword, matchPassword} = require('../config/bcrypt');
const jwt = require('jsonwebtoken');


const generateAccessToken = (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            }
        );
    });
 };


const register = async (req, res) => {
    const {userName, password, email }  = req.body;
    try {
        let user = await   User.findOne({email});
        if(user) {
            return res
            .status(409)
            .json({message : 'User Already Exisit'});
        }
        let profileImage = ''
        if(req.file) {
            profileImage = `uploads/profileImages/${req.file.filename}`;
        }

        const securePassword = await hashPassword(password);

        user = new User ({
            userName,
            email,
            password: securePassword,
            profileImage 
        });

        await user.save();

        res
        .status(200)
        .json({message : "User Register Successfully"});
        
    } catch (error) {
        res
        .status(500)
        .json({message : error.message})
    }
}

const login =  async (req, res) => {
    const {email, password} = req.body;
    console.log('vannu')
    try {
        if(!email || !password){
            return res
            .status(401)
            .json({message : 'Invalid Credinials'});
        }
        let user = await User.findOne({email});
        if(!user) {
            return res
            .status(404)
            .json({message : 'No User Found'});
        }
        const isMatch = await matchPassword(password, user.password);
        if(!isMatch) {
            return res
            .status(400)
            .json({message : 'Invalid Password'});
        }


        const accessToken = await generateAccessToken(user);

        

        res.cookie('accessToken', accessToken, {
            httpOnly: true, // Cannot be accessed via JavaScript
            sameSite: 'Strict', // CSRF protection
            maxAge: 60 * 60 * 1000, // 1 hour
        })
        .status(201).json({
              message : "User login Successfully",
              token : accessToken,
              user,
        });
    } catch (error) {
        return res.status(500).json({message: "Network Problem in Login" + error.message})
    }
    
}

const logout = async (req, res) => {
    res.clearCookie('accessToken');
    res.json({message : 'User Logout Successfully '})
}

const loadProfile = async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-password');
    res.json(user);
}
 
const updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { userName, email } = req.body;


        // Fetch the current user data from the database
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: 'User Not Found' });
        }
    
        // Check if the email is being change
        if (email !== currentUser.email) {
            // Check if the new email is already in use by another user
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }
    
        // Prepare update fields
        let updateFields = { userName, email };
    
        // Check if a new profile image is being uploaded
        if (req.file) {
            updateFields.profileImage = `uploads/profileImages/${req.file.filename}`;
        }
    
        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );
    
        if (!updatedUser) {
            return res.status(404).json({ message: 'User Not Found' });
        }
    
        // Respond with the updated user data
        res.json({updatedUser, message : 'Updated Successfully'});
    
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    register,
    login,
    loadProfile,
    logout,
    updateProfile,
}