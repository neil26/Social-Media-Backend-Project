module.exports = {
    ensureAuthenticated : function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','Please Log in to view this Resource');
        res.redirect('/users/login');
    },
    ensureNotAuthenticated :function(req,res,next){
        if(req.isAuthenticated()){
            return res.redirect('/dashboard');
        }
        next();
    }
}