const mongoose = require('mongoose');

const ChannelShema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    allUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    checked: false
});

const ChannelModel = mongoose.model('Channel', ChannelShema);

module.exports = ChannelModel;