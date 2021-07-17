const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const socialUser = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: true },
    type: { type: String, required: true },
    otp: { type: String, default: "1234" },
    verified: { type: Boolean, default:true},
    email: {
        type: String,
        required: true,

    },
    token: { type: String, required: true },
    password: { type: String, required: true }
});





module.exports = mongoose.model("socialusers", socialUser)