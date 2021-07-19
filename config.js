let nodemailer= require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 487,
    secure: true,
    auth: {
        user: "rajalam2372@gmail.com" ,
        pass: 'happyseraj'
    }
    });

module.exports = {
    MONGODB_URL: "mongodb+srv://seraj_alam:Mongodb@123@cluster0.bcajl.mongodb.net/obsStudio?retryWrites=true&w=majority",
    FROM_EMAIL: "rajalam2372@gmail.com",
    TOKEN_SECRET_KEY: "Happyisagoodprogrammer",
    transporter
}