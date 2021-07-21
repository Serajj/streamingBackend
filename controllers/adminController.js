const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const socialLoginModel = require('../model/socialLoginModel');
const streamModel = require('../model/streamModel');
const user = require('../model/user');
var rn = require('random-number');
const { transporter, FROM_EMAIL } = require('../config');
const assignModel = require('../model/assignModel');


const indexView = (req, res, next) => {
    res.render('home', { 'sessiondata': req.session });

}

const loginView = (req, res, next) => {
    res.render('login');

}


const editorPostView = async (req, res, next) => {
    const body = req.body;
    const salt = await bcrypt.genSalt(10);
    const opass=body.password;
    const passwordHash = await bcrypt.hash(body.password, salt)
    body.password = passwordHash;
    const { firstname,lastname, phone, type, email, password } = body;

    console.log(req.body)

    const checkUser = await user.findOne({ email });

    if (checkUser) {
        return res.status(200).json({success:false, message: "Email already exist !" })
    }

    var options = {
        min:  1000
      , max:  9999
      , integer: true
      }

      let otp =rn(options) // example outputs → -187, 636

    let fromMail = FROM_EMAIL;
    let toMail = email;
    let subject = 'Successfully registered for SSL editor console please login.';
    let text = "Your Login Password : "+opass;

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
    const verified=true;

    const newUser = new user({
        firstname,lastname, phone, type,otp,verified,email, password
    })
//console.log(newUser)
    try {
       await newUser.save();

      

        return res.status(200).json({ success: true, message: "Added Successfully !!"})
    } catch (error) {
        error.status = 400;
        next(error);
    }
}









const loginPostView = async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email);
    const checkUser = await user.findOne({ email });

    if (!checkUser) {
        return res.status(403).json({ error: "Invalid User/password!" })
    }
    const isValid = await bcrypt.compare(password, checkUser.password);
    console.log(isValid);
    if (!isValid) {
        return res.status(405).json({ error: "Incorrect Password" })
    }


    else {
        if (!(checkUser.type == "admin" || checkUser.type == "editor") ){
            return res.status(405).json({ error: "Access denied, You are not Admin" })
        }

        console.log(checkUser);
        console.log("myid "+checkUser._id);
        req.session.loggedin = true;
        req.session.serajisagoodprogrammer = "ofcourse";
        req.session.id = checkUser._id;
        req.session.userid = checkUser._id;
        req.session.firstname = checkUser.firstname;
        req.session.lastname = checkUser.lastname;
        req.session.email = checkUser.email;
        req.session.type = checkUser.type;
        console.log(req.session);
        res.redirect('/admin');
    }

}

const updateUser = (req, res, next) => {

    if (!req.body.myid) {
        return redirect('/admin');
    }
    const { firstname, lastname ,email,phone } = req.body;

    console.log(req.body.id);
    user.findByIdAndUpdate({ _id: req.body.myid },{firstname,lastname,email,phone}, function (err) {

        backURL = req.header('Referer') || '/admin';

        return res.redirect(backURL);

    });
}

const deleteUser = (req, res, next) => {

    if (!req.body.id) {
        return redirect('/admin');
    }
    console.log(req.body.id);
    user.findOneAndRemove({ _id: req.body.id }, function (err) {

        backURL = req.header('Referer') || '/admin';

        return res.redirect(backURL);

    });
}

const deleteAssign = (req, res, next) => {

    if (!req.body.id) {
        return redirect('/admin');
    }
    console.log(req.body.id);
    assignModel.findOneAndRemove({ _id: req.body.id }, function (err) {

        backURL = req.header('Referer') || '/admin';

        return res.redirect(backURL);

    });
}


const userData = (req, res, next) => {

    if (!req.body.id) {
        return redirect('/admin');
    }
    console.log(req.body.id);


    user.findById(req.body.id, function (err, mydata) {

        if (mydata != null)
            return res.status(200).json(extractUserdata(mydata));
        else {
            socialLoginModel.findById(req.body.id, function (err, mydata) {

                if (mydata != null)
                    return res.status(200).json(extractUserdata(mydata));
                else {
                    return res.status(200).json({ data: "not found" });
                }


            });
        }


    });
}

const liveStreamView = (req, res, next) => {
    res.render('stream', { 'sessiondata': req.session  });

}
const allrecordedView = (req, res, next) => {

    streamModel.find({}, function (err, streamList) {
        res.render('allrecordedStreams', { 'sessiondata': req.session , streams: streamList });

    }).sort({ "_id": -1 });

}

const deleteRecordedStream = (req, res, next) => {

    if (!req.body.id) {
        return redirect('/admin');
    }
    console.log(req.body.id);
    streamModel.findOneAndRemove({ _id: req.body.id }, function (err) {

        backURL = req.header('Referer') || '/admin';

        return res.redirect(backURL);

    });
}

const streamView = (req, res, next) => {

    user.find({ type: "streamer" }, function (err, socialUsers) {



        socialLoginModel.find({ type: "streamer" }, function (err, normalUsers) {
            var users = socialUsers.concat(normalUsers);

            res.render('adminStremers', { 'sessiondata': req.session , users: users });
        });


    });




}



const editorView = (req, res, next) => {

    user.find({ type: "editor" }, function (err, socialUsers) {



        socialLoginModel.find({ type: "editor" }, function (err, normalUsers) {
            var users = socialUsers.concat(normalUsers);

            res.render('adminEditors', { 'sessiondata': req.session, users: users });
        });


    });

}



const assignView = (req, res, next) => {

    user.find(function (err, socialUsers) {


        assignModel.find().populate('streamer').populate('editor').// only return the Persons name
        exec(function (err, story) {

           res.render('assignView', { 'sessiondata': req.session , users: socialUsers ,assign:story});
    
      });

    });
}

const assignPostView = async (req, res, next) => {
    const { sid, eid } = req.body;
    const checkUser = await assignModel.findOne({ sid,eid });

    if (checkUser) {
        return res.status(200).json({success:false, message: "They are already assigned."})
    }
   

    else {

     
        const streamer=sid;
        const editor=eid;

         const newUser = new assignModel({
             sid,eid,streamer,editor
         })
       //console.log(newUser)
        try {
           await newUser.save();
            return res.status(200).json({ success: true, message: "Added Successfully !!"})
        } catch (error) {
            error.status = 400;
            next(error);
        }
       
    }

}





const taskView = (req, res, next) => {
    res.render('adminTask', { 'sessiondata': req.session });

}


extractUserdata = user => {
    return ({
        name: user.firstname + " "+user.lastname,
        phone: user.phone,
        email: user.email
    })
}


module.exports = {
    indexView,
    loginView,
    streamView,
    loginPostView,
    streamView,
    liveStreamView,
    editorView,
    taskView,
    deleteUser,
    allrecordedView,
    userData,
    editorPostView,
    assignView,
    assignPostView,
    deleteAssign,
    deleteRecordedStream,
    updateUser
}