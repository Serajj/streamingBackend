const express = require("express");

const { login, register, getStream } = require("../controllers/userController");
const router = express.Router();


router.get('/', (req, res) => res.send('Hello this is protected api route!'))

router.post('/getStreams', getStream)

module.exports = router