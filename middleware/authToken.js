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
                return next();
            } catch (e) {
                return res.status(500).json({ message: "Invalid Token" })
            }
        }

        return res.status(500).json({ message: "Authorization token must be [Bearer token]" })

    }

    return res.status(500).json({ message: "Please Provide Authorization Token" })
}