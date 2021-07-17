const jwt = require("jsonwebtoken");
const { TOKEN_SECRET_KEY } = require("../config");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;


    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];

        if (token) {
            try {
                const user = jwt.verify(token, TOKEN_SECRET_KEY);
                req.user = user;
                if(user.verified){
                    return next();
                }else{
                    return res.status(500).json({ success:false,message: "Verify Email First !" })
                }
                
            } catch (e) {
                return res.status(500).json({ message: "Invalid Token" })
            }
        }

        return res.status(500).json({ message: "Authorization token must be [Bearer token]" })

    }

    return res.status(500).json({ message: "Please Provide Authorization Token" })
}