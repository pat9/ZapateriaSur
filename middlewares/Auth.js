
const Auth = (req, res, next) =>{
    if(req.session.user == undefined){
        res.render('Error/Unauthorised', {status:403})
        return;
    }
    next();
}

module.exports = Auth;