const mongoose = require('mongoose')

const connectMonogDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MONGO DB');
        
    } catch (error) {
        console.log(`${error.message} in Monogo DB`)
    }
}

module.exports = connectMonogDB