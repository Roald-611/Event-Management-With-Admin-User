const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Events = require('../models/event')


const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email!')
            }
        }
    }, password: {
        type: String,
        require: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.includes('password')) {
                throw new Error(`Password can't contain "password"`);
            }
        }
    }, age: {
        type: Number,
        trim: true,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('age must be a positive number');
            }
        }
    }, tokens: [{
        token: {
            type: String,
            required: true
        }
    }], avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

adminSchema.virtual('events', {
    ref: 'Events',
    localField: '_id',
    foreignField: 'owner'
})

adminSchema.methods.toJSON = function () {
    const admin = this;
    const adminObject = admin.toObject();

    delete adminObject.password;
    delete adminObject.tokens;
    delete adminObject.avatar;

    return adminObject;
}

adminSchema.methods.generateAuthToken = async function () {
    const admin = this;
    // console.log(admin);
    const token = jwt.sign({ _id: admin._id.toString() }, process.env.JWT_TOKEN)
    // console.log(token);
    admin.tokens = admin.tokens.concat({ token })
    await admin.save()

    return token;
}

adminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({ email })
    // console.log(admin);
    if (!admin) {
        throw new Error('Unable to login!')
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    // console.log(isMatch);
    if (!isMatch) {
        throw new Error('Unable to login!')
    }
    return admin
}

adminSchema.pre('save', async function (next) {
    const admin = this
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }
    next();
})

adminSchema.pre('remove', async function (next) {
    const admin = this;
    await Events.deleteMany({ owner: admin._id })
    next();
})

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;