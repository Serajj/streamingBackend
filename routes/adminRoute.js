const express = require("express");

const { checkAuth } = require('../auth/checklogin');

const { loginView, indexView, streamView, loginPostView, liveStreamView, editorView, taskView, deleteUser, allrecordedView, userData, editorPostView, assignView, assignPostView, deleteAssign, deleteRecordedStream, updateUser } = require("../controllers/adminController");


const router = express.Router();


router.get('/', checkAuth, indexView);


router.get('/login', loginView);

router.post('/login', loginPostView);

router.post('/addeditor', editorPostView);

router.post('/deleteUser', checkAuth, deleteUser);

router.post('/updateUser', checkAuth, updateUser);


router.post('/userdata', checkAuth, userData);

router.get('/streams', checkAuth, liveStreamView
);

router.get('/allstreams', checkAuth, allrecordedView);
router.post('/deleteStream', checkAuth, deleteRecordedStream);



router.get('/stremers', checkAuth, streamView);

router.get('/editors', checkAuth, editorView);

router.get('/task', checkAuth, taskView);


router.get('/assign', checkAuth, assignView);

router.post('/assign', checkAuth, assignPostView);

router.post('/deleteAssign', checkAuth, deleteAssign);





router.get('/logout', checkAuth, (req, res) => {
    req.session.loggedin = false;
    req.session.serajisagoodprogrammer = "disco";
    req.session.id = null;
    req.session.name = null;
    req.session.email = null;
    req.session.type = null;

    res.redirect('/admin');
});
module.exports = router;