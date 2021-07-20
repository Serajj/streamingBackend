const express = require("express");
const { checkEditor } = require("../auth/checkEditor");
const { indexView, liveStreamView, allrecordedView } = require("../controllers/editorController");

const router = express.Router();

router.get('/', checkEditor, indexView);


router.get('/streams', checkEditor, liveStreamView );

router.get('/allstreams', checkEditor, allrecordedView);


router.get('/logout', checkEditor, (req, res) => {
    req.session.loggedin = false;
    req.session.serajisagoodprogrammer = "disco";
    req.session.id = null;
    req.session.name = null;
    req.session.email = null;
    req.session.type = null;

    res.redirect('/admin');
});

module.exports = router;