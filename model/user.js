const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: true },
    type: { type: String, required: true },
    otp: { type: String, required: true },
    verified: { type: Boolean, default:false},
    email: {
        type: String,
        required: true,
        validate: [emailvalidator, "Incorrect email format"]
    },
    password: { type: String, required: true }
});

function emailvalidator(value) {
    return /^.+@.+\..+$/.test(value)
}



module.exports = mongoose.model("user", userSchema)