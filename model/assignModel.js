const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const assignModel = new Schema({
    sid: { type: String, required: true },
    eid: { type: String, required: true },
    streamer: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
    editor: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
});





module.exports = mongoose.model("assign", assignModel)