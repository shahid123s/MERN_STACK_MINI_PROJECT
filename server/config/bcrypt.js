const bcrypt = require('bcrypt');

const hashPassword = async (password) => { 
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
        
    } catch (error) {
        console.log(`Error happens on Hashing Password due to ${error.message}`)
    }
} 

const matchPassword = async (password, userPass) => {
    try {
        let checkPassword = await bcrypt.compare(password, userPass);
        return checkPassword;
    } catch (error) {
        console.log(`Error happens on compare on password due to ${error.message}`)
    }
} 

module.exports = {
    hashPassword,
    matchPassword,
}