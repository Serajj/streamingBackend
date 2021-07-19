const express = require("express");
const { checkEditor } = require("../auth/checkEditor");
const { indexView, liveStreamView, allrecordedView } = require("../controllers/editorController");

const router = express.Router();

router.get('/', checkEditor, indexView);


router.get('/streams', checkEditor, liveStreamView );

router.get('/allstreams', checkEditor, allrecordedView);

module.exports = router;