const UserModel = require('../models/userModel');
const ChannelModel = require('../models/channelModel');

createChannel = async (req, res) => {
    let data = req.body;
    try {
        let user = req.user;
        let channel = new ChannelModel();
        channel.title = data.title;

        let createdChannel = await channel.save();
        res.json(createdChannel)
    } catch (e) {
        console.log(e)
        res.status(400).json()
    }
};

getAllChannels = async (req, res) => {
    try {
        let channelUsers = await ChannelModel.find();
        res.json(channelUsers)
    } catch (e) {
        res.status(400).json(e);
    }
};

addUserToChannel = async (req, res) => {
    let userName = req.body.userName;
    let channelId = req.body.channelId;
    try {
        let user = await UserModel.findOne({
            userName
        });

        let channel = await ChannelModel.findById(channelId)
        if (!user) return res.status(400).json('No such user');

        channel.allUsers.push(user._id);

        let saveChannel = await channel.save();

        res.json({
            channel,
            user,
            saveChannel
        })
    } catch (e) {
        console.log(e)
        res.status(400).json(e);
    }
};

getAllChannelUsers = async (req, res) => {
    let userName = req.userName;

    try {
        let allChannelUsers = await ChannelModel.findOne({
            user: userName,
        }).populate('allUsers');

        res.json(allChannelUsers)


    } catch (e) {
        res.status(400).json(e)
    }
};

deleteChannel = async (req, res) => {
    let channelId = req.body.channelId;

    try {
        let response = await ChannelModel.deleteOne(channelId);

        if (response.deletedCount == 0) res.status(400).json("item doesnt exist")
        res.json('Item deleted')
    } catch (e) {
        console.log(e)
        res.status(400).json('Channel can\'t be deleted')
    }
}

toogleChannel = async (req, res) => {
    let channelId = req.body.channelId;
    try {
        let channel = await ChannelModel.findOne(channelId)
        channel.checked = !channel.checked;
        await channel.save();
        res.json(channel)
    } catch (e) {
        res.status(400).json(e)
    }
};

deleteUserFromChannel = async (req, res) => {
    let id = req.body.user;
    let channelId = req.body.channelId;

    try {
        let channel = await ChannelModel.findById(channelId)

        channel.allUsers.pull(id);
        channel = await channel.save();

        res.json(`User ${id} is deleted`)
    } catch (e) {
        console.log(e)
        res.status(400).json('User can\'t be deleted')
    }
};


module.exports = {
    createChannel,
    getAllChannels,
    addUserToChannel,
    getAllChannelUsers,
    deleteChannel,
    toogleChannel,
    deleteUserFromChannel
};