const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secretPassword } = require('../config/config');

register = async (req, res) => {
  let data = req.body;
  let user = new UserModel();

  user.userName = data.userName;
  user.email = data.email;
  user.password = data.password;

  try {
    let createUser = await user.save();
    res.json(createUser);
  } catch (e) {
    res.status(400).json(e);
  }
};

getAllUsers = async (req, res) => {
  try {
    let allUsers = await UserModel.find();
    res.json(allUsers);
  } catch (e) {
    res.status(400).json(e);
  }
};

login = async (req, res) => {
  let data = req.body;
  try {
    let user = await UserModel.findOne({
      userName: data.userName,
    });
    if (!user) return res.status(400).json('There is no such user');
    const match = await bcrypt.compare(data.password, user.password);
    if (!match) return req.status(400).json('You entered the wrong password');

    let role = 'userRole';
    let token = jwt.sign(
      {
        id: user._id,
      },
      secretPassword
    );

    user.tokens.push({
      token: token,
      role: role,
    });
    user.save();

    res.header('x-auth-msg', token).json(user);
  } catch (e) {
    res.status(400).json(e);
  }
};

logout = async (req, res) => {
  let user = req.user;
  let token = req.token;
  await user.update({
    $pull: {
      tokens: {
        token: token,
      },
    },
  });
  res.json('You just signed out');
};

changePicture = async (req, res) => {
  let user = req.user;
  user.profilePicture = `http://localhost:4000/${req.file.path}`;
  let savedUser = await user.save();
  res.json(savedUser);
};

module.exports = {
  register,
  getAllUsers,
  login,
  logout,
  changePicture,
};
