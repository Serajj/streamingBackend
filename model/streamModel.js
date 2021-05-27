const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const streamModel = new Schema({
    stream_id: { type: String, unique: true, required: true, dropDups: true },
    user_id: { type: String, required: true },
    stream_name: { type: String, required: true },
    venue: { type: String, required: true },
    cover_image: { type: String, required: true }
});





module.exports = mongoose.model("mystreams", streamModel)