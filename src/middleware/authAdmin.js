const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace("Bearer ", "");
        // console.log(token);
        // const token = req.header('Authorization');

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token });


        if (!admin) {
            throw new Error("We can't Find User");
        }
        req.token = token;
        // console.log('Auth3');

        req.admin = admin;
        console.log("Auth Sucess2!");
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please Authenticate your self!.' })
    }
}
module.exports = auth;