let nodemailer= require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'mail.rgcompany.xyz',
    port: 465,
    secure: true,
    auth: {
        user: "ssl@rgcompany.xyz" ,
        pass: 'Patna123?'
    }
    });

module.exports = {
    MONGODB_URL: "mongodb+srv://seraj_alam:Mongodb@123@cluster0.bcajl.mongodb.net/obsStudio?retryWrites=true&w=majority",
    FROM_EMAIL: "ssl@rgcompany.xyz",
    TOKEN_SECRET_KEY: "Happyisagoodprogrammer",
    transporter
}