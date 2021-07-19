const user = require("../model/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET_KEY, transporter, FROM_EMAIL } = require("../config");
const saveStreamModel = require("../model/saveStreamModel");
const streamModel = require("../model/streamModel");
var shortid = require('shortid');
const socialLoginModel = require("../model/socialLoginModel");
const path = require('path');
const nodemailer = require('nodemailer');
var rn = require('random-number');
const assignModel = require("../model/assignModel");



exports.register = async (req, res, next) => {
    const body = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password, salt)
    body.password = passwordHash;
    const { firstname,lastname, phone, type, email, password } = body;

    console.log(req.body)

    const checkUser = await user.findOne({ email });

    if (checkUser) {
        return res.status(403).json({ error: "Email already exist !" })
    }

    var options = {
        min:  1000
      , max:  9999
      , integer: true
      }

      let otp =rn(options) // example outputs → -187, 636
      
      FROM_EMAIL


    let fromMail = FROM_EMAIL;
    let toMail = email;
    let subject = 'Streaming App Email verification';
    let text = "verification  OTP : "+otp;

    let mailOptions = {
        from: fromMail,
        to: toMail,
        subject: subject,
        text: text
        };

    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log(error);
        }
        console.log(response)
        });


    const newUser = new user({
        firstname,lastname, phone, type,otp,email, password
    })
//console.log(newUser)
    try {
       await newUser.save();

        const token = getSignInToken(newUser);

        return res.status(200).json({ success: true, message: "Signup and logged In Successfully !!", token: token, data: getUserData(newUser) })
    } catch (error) {
        error.status = 400;
        next(error);
    }
}


exports.socialUserInfo = async (req, res, next) => {
    const body = req.body;

    if (!body.firstname) {
        res.status(422).json({ success: false, message: "Please Provide  name" });
    }

    if (!body.lastname) {
        res.status(422).json({ success: false, message: "Please Provide  name" });
    }
    if (!body.email) {
        res.status(422).json({ success: false, message: "Please Provide  email" });
    }
    if (!body.token) {
        res.status(422).json({ success: false, message: "Please Provide social auth token" });
    }
    if (!body.type) {
        res.status(422).json({ success: false, message: "Please Provide user type" });
    }





    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("mynewpassword", salt)
    body.password = passwordHash;
    const { firstname,lastname,type, email, password} = body;
    const phone = "9140327455";
    console.log(req.body)

    const checkUser = await user.findOne({ email });

    if (checkUser) {
        const tsoken = getSignInToken(checkUser);
        return res.status(200).json({ success: true, message: "logged In Successfully !!", token: tsoken, data: getUserData(checkUser) })
    }



    const otp = body.token;
    const verified =true;
    const newUser = new user({
        firstname,lastname, phone, type,otp,verified,email, password
    })

    try {
        await newUser.save();

        const token = getSignInToken(newUser);

        return res.status(200).json({ success: true, message: "logged In Successfully !!", token: token, data: getUserData(newUser) })
    } catch (error) {
        error.status = 400;
        next(error);
    }
}


exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    const checkUser = await user.findOne({ email });

    if (!checkUser) {
        return res.status(403).json({ error: "Invalid User/password!" })
    }
    const isValid = await bcrypt.compare(password, checkUser.password);
    console.log(isValid);
    if (!isValid) {
        return res.status(405).json({success:false, error: "Incorrect Password" })
    }
    else {
        console.log(checkUser.verified);
        console.log("Hello");

        if(!checkUser.verified){
            return res.status(200).json({success:false, message: "Verify Email First !" })
        }
        const token = getSignInToken(checkUser);
        return res.status(200).json({ success: true, message: "Login Successful !!", token: token, data: getUserData(checkUser) })
    }

}


exports.verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body;

    const checkUser = await user.findOne({ email });

    if (!checkUser) {
        return res.status(403).json({ error: "Invalid User!" })
    }
    else {
   
        if(!(checkUser.otp == otp)){
            return res.status(200).json({success:false, message: "Invalid OTP !" })
        }
        let updatedUser = await user.updateOne({email:email}, { verified: true });

        const token = getSignInToken(checkUser);
        return res.status(200).json({ success: true, message: "Login Successful !!", token: token, data: getUserData(checkUser) })
    }

}


exports.verifyOtpAndChangePassword = async (req, res, next) => {

    const body = req.body;
 

    if (!body.password) {
        res.status(422).json({ success: false, message: "Please Provide new password" });
    }

    if (!body.otp) {
        res.status(422).json({ success: false, message: "Please Provide OTP" });
    }
    if (!body.email) {
        res.status(422).json({ success: false, message: "Please Provide email" });
    }
  
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password, salt)
    body.password = passwordHash;
    const { email, otp ,password} = req.body;

    const checkUser = await user.findOne({ email });

    if (!checkUser) {
        return res.status(200).json({ success:false,error: "Invalid User!" })
    }
    else {
        console.log(checkUser.otp == otp);
        if(!(checkUser.otp == otp)){
            return res.status(200).json({ success:false,message: "Invalid OTP !" })
        }else{

            await user.updateOne({email:email}, { password: password });

        return res.status(200).json({ success: true, message: "Password updated successfully!,Please Login !!" })
        }

        
    }

}



exports.sendOtp = async (req, res, next) => {
     const body=req.body;
    if (!body.email) {
        res.status(422).json({ success: false, message: "Please Provide  email" });
    }

    const { email} = req.body;

    const checkUser = await user.findOne({ email });

    if (!checkUser) {
        return res.status(403).json({ error: "Email not exist please register first." })
    }
    else {

        var options = {
            min:  1000
          , max:  9999
          , integer: true
          }
    
        let otp =rn(options) // example outputs → -187, 636
          
       let updatedUser = await user.updateOne({email:email}, { otp: otp });
       console.log(otp);
       console.log(updatedUser);
    
        let fromMail = FROM_EMAIL;
        let toMail = email;
        let subject = 'Streaming App Email verification';
        let text = "verification  OTP : "+otp;
    
        let mailOptions = {
            from: fromMail,
            to: toMail,
            subject: subject,
            text: text
            };
    
        transporter.sendMail(mailOptions, (error, response) => {
            if (error) {
                console.log(error);
            }
            console.log(response)
            });


        return res.status(200).json({ success: true, message: "OTP has been sent to your email"})
    }

}






exports.getStream = async (req, res) => {

    var streams = {};
    await streamModel.find({ user_id: req.user.id }, function (err, allstreams) {
        //var streams = {};

        // allstreams.forEach(function (stream) {
        //     streams[stream._id] = stream;
        // });
        res.status(200).json({ success: true, message: "Stream fetched successfully", data: allstreams });

    });

}


//streams

exports.startStream = async (req, res) => {


    if (!req.body.stream_name) {
        res.status(422).json({ success: false, message: "Please Provide stream name" });
    }

    if (!req.body.venue) {
        res.status(422).json({ success: false, message: "Please Provide stream venue" });
    }

    // if (!req.body.cover_image) {
    //     res.status(422).json({ success: false, message: "Please Provide stream cover_image" });
    // }



    // if (!req.files || Object.keys(req.files).length === 0) {
    //     return res.status(400).send('Please Choose file first');
    // }

    // sampleFile = req.files.cover_image;
    // uploadPath = path.dirname(require.main.filename) + '/public/uploads/streamcovers/' + sampleFile.name;

    // // Use the mv() method to place the file somewhere on your server
    // sampleFile.mv(uploadPath, function (err) {
    //     if (err)
    //         return res.status(500).send(err.message);


    // });

    // console.log(sampleFile.name);
    var streamId = shortid.generate();
    console.log(streamId);

    var myStream = new streamModel({
        stream_id: streamId,
        user_id: req.user.id,
        stream_name: req.body.stream_name,
        venue: req.body.venue,
        cover_image: "myimage.png"
    })

    try {
        await myStream.save();
    } catch (error) {
        res.status(200).json({ success: false, message: "Unable to start stream", error: error.message });
    }


    // while (!checkUniqueStreamId(streamId)) {
    //     streamId = shortid.generate();
    // }
    console.log("final " + streamId);


    res.status(200).json({ success: true, message: "Stream records saved successfully", stream_id: streamId });
}

getSignInToken = user => {
    return jwt.sign({
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        verified: user.verified
    }, TOKEN_SECRET_KEY, { expiresIn: "6h" })
}

getUserData = user => {
    return ({
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        verified: user.verified
    })
}

checkUniqueStreamId = streamId => {
    streamModel.findOne({ stream_id: streamId }, function (err, obj) {

        if (obj) {
            return obj;
        }
        return "not unique";
    });
}



exports.testApi = async (req, res, next) => {
   

   
    user.find(function (err, socialUsers) {


        assignModel.find().populate('streamer').populate('editor').// only return the Persons name
        exec(function (err, story) {

    return res.status(200).json({ success: true, message: "Login Successful !!",assign:story})
    
      });



     


    });

    
    
    

}

