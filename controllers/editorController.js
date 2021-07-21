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

    const user_id = req.session.id;
    streamModel.find({user_id}, function (err, streamList) {
        res.render('allrecordedStreams', { 'sessiondata': req.session , streams: streamList });

    }).sort({ "_id": -1 });

}


const assignedStreamers = (req, res, next) => {

    const eid = req.session.userid;
    assignModel.find({eid}).populate('streamer').populate('editor').// only return the Persons name
        exec(function (err, story) {
           res.render('assignedStreamer', { 'sessiondata': req.session ,assign:story});
      });

}




module.exports = {
    indexView,

    liveStreamView,

    allrecordedView,
    assignedStreamers

}