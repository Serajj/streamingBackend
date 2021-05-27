const express = require("express");

const { checkAuth } = require('../auth/checklogin');
const socialLoginModel = require("../model/socialLoginModel");
const user = require("../model/user");




const router = express.Router();


router.get('/', (req, res) => {

    user.findById(
        "60961f2da0f4f852420fd91b", function (err, socialUsers) {

            return res.send(socialUsers);

        });


});





module.exports = router;