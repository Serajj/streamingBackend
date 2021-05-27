const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const socialUser = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    type: { type: String, required: true },
    email: {
        type: String,
        required: true,

    },
    token: { type: String, required: true },
    password: { type: String, required: true }
});





module.exports = mongoose.model("socialusers", socialUser)