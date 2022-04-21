const jwt = require('jsonwebtoken');
const User = require('../models/users');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace("Bearer ", "");
        // console.log(token);
        // const token = req.header('Authorization');

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });


        if (!user) {
            throw new Error("We can't Find User");
        }
        req.token = token;
        // console.log('Auth3');

        req.user = user;
        console.log("Auth Sucess!");
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please Authenticate your self!.' })
    }
}
module.exports = auth;