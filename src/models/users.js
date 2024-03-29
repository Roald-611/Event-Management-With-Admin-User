const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
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

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_TOKEN)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login!')
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login!')
    }
    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

// userSchema.pre('remove', async function (next){
//     const user=this;
//     await 
// })

const User = mongoose.model('User', userSchema);

module.exports = User;