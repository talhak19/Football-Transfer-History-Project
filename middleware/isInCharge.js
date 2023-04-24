module.exports = (req,res,next)=>{
    if (!req.session.isAuthenticated) {
        return res.redirect("/login");
    }

    if (!req.director.inCharge) {
        return res.redirect("/");
    }

    next();
}