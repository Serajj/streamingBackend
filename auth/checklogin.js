
const checkAuth = (req, res, next) => {
    let token = req.session;
    if (token) {
        // Remove Bearer from string
        if (token.loggedin && token.serajisagoodprogrammer == "ofcourse" && token.name != null) {

            next();
            console.log("hello dear" + token.name);

        } else {
            res.redirect('/admin/login');
        }

    } else {
        res.redirect('/admin/login');
    }
}

module.exports = {
    checkAuth
}