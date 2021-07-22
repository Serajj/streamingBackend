const express = require("express");

const { checkAuth } = require('../auth/checklogin');
const assignModel = require("../model/assignModel");
const socialLoginModel = require("../model/socialLoginModel");
const streamModel = require("../model/streamModel");
const user = require("../model/user");




const router = express.Router();


router.get('/', (req, res) => {

   
    console.log(req.body.id);


    const eid = req.body.id;
    assignModel.find({eid}).select('sid').// only return the Persons name
        exec(function (err, story) {
           var myids=[];
            for (const val of story) { 
                console.log(val);
                myids.push(val.sid);
            }



        streamModel.find({
                'user_id': { $in: myids},'status':'live'
            }).select('stream_id').// only return the Persons name
        exec(function (err, docs) {

            var strmids=[];
            for (const val of docs) { 
                console.log(val);
                strmids.push(val.stream_id);
            }
            return res.status(200).json({ streams: strmids});

        })
            

      });


    // streamModel.findById(req.body.id, function (err, mydata) {

    // });

});





module.exports = router;