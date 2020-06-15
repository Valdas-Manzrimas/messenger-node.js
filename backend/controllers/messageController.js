const UserModel = require('../models/userModel');
const ChannelModel = require('../models/channelModel');
const MessageModel = require('../models/messageModel');

createMessage = async (req, res) => {
    let data = req.body;
    let user = req.user;

    try {
        let message = new MessageModel();
        message.user = user._id;
        message.message = data.message;
        message.recipient = await ChannelModel.findById()

        if (data.recipient) {
            message.recipient = data.recipient;
        } else {
            message.channel = data.channel
        }

        let createdMessage = await message.save()
        res.json(createdMessage)
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
}

getAllMessages = async (req, res) => {
    try {
        let message = await MessageModel.find()

        res.json(message)
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
}

module.exports = {
    createMessage,
    getAllMessages
};