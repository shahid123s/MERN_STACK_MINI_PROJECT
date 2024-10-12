const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json({message : 'No access token : authorization rejected'});

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode)
        req.user = decode;
        next();
        
    } catch (error) {
        res.status(500).json({message : 'No access token : authorization rejected' })
        console.log(error.message);
    }
}

module.exports = authenticate