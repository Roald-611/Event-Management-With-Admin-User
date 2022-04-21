const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const URL = process.env.MONGODB_URL.toString();

mongoose.connect(URL);