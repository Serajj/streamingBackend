const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const socialLoginModel = require('../model/socialLoginModel');
const streamModel = require('../model/streamModel');
const user = require('../model/user');
var rn = require('random-number');
const { transporter, FROM_EMAIL } = require('../config');
const assignModel = require('../model/assignModel');


const indexView = (req, res, next) => {
    res.render('editorhome', { 'sessiondata': req.session });

}





const liveStreamView = (req, res, next) => {
    res.render('editorStream', { 'sessiondata': req.session  });

}
const allrecordedView = (req, res, next) => {

    streamModel.find({}, function (err, streamList) {
        res.render('allrecordedStreams', { 'sessiondata': req.session , streams: streamList });

    }).sort({ "_id": -1 });

}




module.exports = {
    indexView,

    liveStreamView,

    allrecordedView,

}