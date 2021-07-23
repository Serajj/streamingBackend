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
    const eid = req.session.userid;
    assignModel.find({eid}).select('sid').// only return the Persons name
    exec(function (err, story) {
       var myids=[];
        for (const val of story) { 
           // console.log(val);
            myids.push(val.sid);
        }



    streamModel.find({
            'user_id': { $in: myids},'status':'live'
        })// only return the Persons name
    exec(function (err, docs) {

        
        res.render('allrecordedStreams', { 'sessiondata': req.session , streams: docs });

    }).sort({ "_id": -1 });
        

  });









    // const user_id = req.session.id;
    // streamModel.find({user_id}, function (err, streamList) {
    //     res.render('allrecordedStreams', { 'sessiondata': req.session , streams: streamList });

    // }).sort({ "_id": -1 });

}


const assignedStreamers = (req, res, next) => {

    const eid = req.session.userid;
    assignModel.find({eid}).populate('streamer').populate('editor').// only return the Persons name
        exec(function (err, story) {
           res.render('assignedStreamer', { 'sessiondata': req.session ,assign:story});
      });

}


const liveStreamData = (req, res, next) => {

    const eid = req.session.userid;
    assignModel.find({eid}).select('sid').// only return the Persons name
        exec(function (err, story) {
           var myids=[];
            for (const val of story) { 
               // console.log(val);
                myids.push(val.sid);
            }



        streamModel.find({
                'user_id': { $in: myids},'status':'live'
            }).select('stream_id').// only return the Persons name
        exec(function (err, docs) {

            var strmids=[];
            for (const val of docs) { 
                //console.log(val);
                strmids.push(val.stream_id);
            }
            return res.status(200).json({ streams: strmids});

        })
            

      });
}




module.exports = {
    indexView,

    liveStreamView,

    allrecordedView,
    assignedStreamers,
    liveStreamData

}