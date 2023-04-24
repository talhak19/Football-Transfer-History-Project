module.exports = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.inCharge = req.director ? req.director.inCharge : false;
    next();
}