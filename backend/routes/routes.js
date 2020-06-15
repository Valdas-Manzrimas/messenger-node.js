const router = require('express').Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});
const uploads = multer({
    storage: storage,
});

const userController = require('../controllers/userController');
const channelController = require('../controllers/channelController');
const messageController = require('../controllers/messageController');
const middleware = require('../middleware/middleware');

//user routes
router.post('/user/register', userController.register);
router.get('/getAllUsers', middleware.authenticate, userController.getAllUsers);
router.post('/user/login', userController.login);
router.get('/user/logout', middleware.authenticate, userController.logout);
router.post(
    '/user/changeProfPicture',
    middleware.authenticate,
    uploads.single('profilePicture'),
    userController.changePicture
);

// channel routes
router.post('/createChannel', middleware.authenticate, channelController.createChannel);
router.get('/getAllChannels', middleware.authenticate, channelController.getAllChannels);
router.post('/addUserToChannel', middleware.authenticate, channelController.addUserToChannel);
router.get('/getAllChannelUsers', middleware.authenticate, channelController.getAllChannelUsers);
router.get('/deleteChannel/:channelId', channelController.deleteChannel);
router.get('/toogleChannel/:channelId', channelController.toogleChannel);
router.post('/deleteUserFromChannel', middleware.authenticate, channelController.deleteUserFromChannel);

//message routes
router.post('/createMessage', middleware.authenticate, messageController.createMessage);
router.get('/getAllMessages/:channelId', middleware.authenticate, messageController.getAllMessages)

module.exports = router;