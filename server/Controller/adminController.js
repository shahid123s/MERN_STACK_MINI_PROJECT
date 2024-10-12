const User = require('../Model/UserModel');
const { matchPassword } = require('../config/bcrypt');
const jwt = require('jsonwebtoken');


const generateAccessToken = (user) => {
    return new Promise((resolve, reject) => {
        if (user.role !== 'admin') {
            reject('This is not admin')
        } else {
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
        }
    })
};


const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });

    if (!user) {
        return res
            .status(404)
            .json({ message: 'Invalid User' })
    }
    if (user.role != 'admin') {
        return res
            .status(401)
            .json({ message: 'Not a Admin' })
    };

    const isMatchPassword = await matchPassword(password, user.password);

    if (!isMatchPassword) {
        return res
            .status(401)
            .json({ message: 'Invalid Password' })
    }

    const adminToken = await generateAccessToken(user);



    res.cookie('adminToken', adminToken, {
        httpOnly: true, // Cannot be accessed via JavaScript
        sameSite: 'Strict', // CSRF protection
        maxAge: 2 * 60 * 60 * 1000, // 2 hour
    })
        .status(201)
        .json({
            message: 'Admin Login Successfully',
            adminToken,
            user
        })
}



const loadAdminData = async (req, res) => {
    try {
        const id = req.params.userId;
        const user = await User.findById(id).select('-password');
        console.log(user)
        res.status(200).json(user)
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Network Probelm" + error.message })
    }
}


const loadUsersData = async (req, res) => {
    try {
        const usersData = await User.find({ role: 'user' }).select('-password  -role').sort({userName : 1});
        res.json(usersData)
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Network problem' + error.message })
    }
}

const editUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId)
        const { email, userName } = req.body;

        console.log(email, userName)

        const currentUser = await User.findById(userId);
        console.log(currentUser)
        if (!currentUser) {
            return res.status(404).json({ message: 'User Not Found ' });
        }

        if (email !== currentUser.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email Already Use' })
            }
        }

        let updatedFields = { userName, email };

        if (req.file) {
            updatedFields.profileImage = `uploads/profileImages/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updatedFields },
            { new: true, runValidators: true }
        );

        console.log(updatedUser);

        if (!updatedFields) {
            return res
                .status(404)
                .json({ message: 'User Not Found ivda' })
        };

        res
            .status(200)
            .json({ message: 'Updated Successfully', updatedUser })

    } catch (error) {
        console.log("Error on update", error)
    }

}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Delete Done Successfully' });
    } catch (error) {
        res.status(500)
            .json({ message: 'Network Issue' + error.message })
    }

}

const searchUser = async (req, res) => {
    const { searchData } = req.body;
    const search = searchData.trim().replace(/[^a-zA-Z0-9]/g, "");
    const response = await User.find({
        $and: [
            { userName: { $regex: new RegExp(`^${search}`, "i") } },
            { role: 'user' }
        ]
    }).sort({ userName: 1 });
    res.status(200).json(response)
}


module.exports = {
    adminLogin,
    loadAdminData,
    loadUsersData,
    editUser,
    deleteUser,
    searchUser,
}