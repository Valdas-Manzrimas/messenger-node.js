const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: false
    },
    message: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tokens: [{
        token: {
            type: String
        },
        role: {
            type: String
        }
    }]
})

const MessageModel = mongoose.model('message', MessageSchema);

module.exports = MessageModel;