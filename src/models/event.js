const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
    event: {
        type: String,
        require: true,
        trim: true
    }, owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }, requirement: {
        type: String,
        require: true,
        trim: true
    }, description: {
        type: String,
        require: true,
        trim: true
    }, date: {
        type: String,
        require: true
    }, completed: {
        type: Boolean,
        default: false
    }

}, {
    dates: true,
    timestamps: true
});


const Event = mongoose.model('Event', eventSchema)

module.exports = Event;