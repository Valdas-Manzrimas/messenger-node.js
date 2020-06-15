const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { secretPassword } = require('../config/config');

authenticate = async (req, res, next) => {
  let token = req.header('x-auth-msg');
  if (!token) return res.status(403).json('You are not authorized');
  try {
    let decoded = jwt.verify(token, secretPassword);
    let user = await UserModel.findOne({
      _id: decoded.id,
      'tokens.token': token,
    });
    if (!user) throw 'e';
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    return res.status(403).json('You are not authorized');
  }
};

module.exports = {
  authenticate,
};
