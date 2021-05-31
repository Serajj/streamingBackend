const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const socialLoginModel = require('../model/socialLoginModel');
const streamModel = require('../model/streamModel');
const user = require('../model/user');


const indexView = (req, res, next) => {
    res.render('home', { 'username': req.session.name });

}

const loginView = (req, res, next) => {
    res.render('login');

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
        if (checkUser.type != "admin") {
            return res.status(405).json({ error: "Access denied, You are not Admin" })
        }
        req.session.loggedin = true;
        req.session.serajisagoodprogrammer = "ofcourse";
        req.session.id = checkUser.id;
        req.session.name = checkUser.name;
        req.session.email = checkUser.email;
        res.redirect('/admin');

    }

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
    res.render('stream', { 'username': req.session.name });

}
const allrecordedView = (req, res, next) => {

    streamModel.find({}, function (err, streamList) {
        res.render('allrecordedStreams', { 'username': req.session.name, streams: streamList });

    }).sort({ "_id": -1 });

}

const streamView = (req, res, next) => {

    user.find({ type: "streamer" }, function (err, socialUsers) {



        socialLoginModel.find({ type: "streamer" }, function (err, normalUsers) {
            var users = socialUsers.concat(normalUsers);

            res.render('adminStremers', { 'username': req.session.name, users: users });
        });


    });




}

const editorView = (req, res, next) => {
    res.render('adminEditors', { 'username': req.session.name });

}

const taskView = (req, res, next) => {
    res.render('adminTask', { 'username': req.session.name });

}


extractUserdata = user => {
    return ({
        name: user.name,
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
    userData
}