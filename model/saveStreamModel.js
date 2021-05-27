const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const streamSchema = new Schema({
    id: { type: String, required: true },
    path: { type: String, required: true },
    url: { type: String, required: true }
});





module.exports = mongoose.model("streams", streamSchema)