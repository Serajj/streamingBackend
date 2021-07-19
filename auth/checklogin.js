
const checkAuth = (req, res, next) => {
    let token = req.session;
    if (token) {
        // Remove Bearer from string
        if (token.loggedin && token.serajisagoodprogrammer == "ofcourse" && token.firstname != null) {

            if(token.type=="admin"){
                next();
            }else{
                res.redirect('/editor');
            }
            console.log("hello dear" + token.firstname);

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