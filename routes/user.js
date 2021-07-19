const express = require("express");

const { login, register, getStream, startStream, socialUserInfo, sendOtp, verifyOtp, testApi, verifyOtpAndChangePassword } = require("../controllers/userController");
const authToken = require("../middleware/authToken");

const router = express.Router();


router.get('/', (req, res) => res.send('Hello this is api route!'))
router.post('/test', testApi)

router.post('/login', login)

router.post('/sendOtp', sendOtp);

router.post('/verifyOtp', verifyOtp);

router.post('/verifyOtpAndChangePassword',verifyOtpAndChangePassword);

router.post('/socialLogin', socialUserInfo)

router.post('/register', register)

router.post('/getStreams', authToken, getStream)

router.post('/startStream', authToken, startStream)
module.exports = router