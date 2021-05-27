const express = require("express");

const { checkAuth } = require('../auth/checklogin');

const { loginView, indexView, streamView, loginPostView, liveStreamView, editorView, taskView, deleteUser, allrecordedView, userData } = require("../controllers/adminController");


const router = express.Router();


router.get('/', checkAuth, indexView);


router.get('/login', loginView);

router.post('/login', loginPostView);

router.post('/deleteUser', checkAuth, deleteUser);

router.post('/userdata', checkAuth, userData);

router.get('/streams', checkAuth, liveStreamView
);

router.get('/allstreams', checkAuth, allrecordedView);


router.get('/stremers', checkAuth, streamView);

router.get('/editors', checkAuth, editorView);

router.get('/task', checkAuth, taskView);

router.get('/logout', checkAuth, (req, res) => {
    req.session.loggedin = false;
    req.session.serajisagoodprogrammer = "disco";
    req.session.id = null;
    req.session.name = null;
    req.session.email = null;
    res.redirect('/admin');
});
module.exports = router;