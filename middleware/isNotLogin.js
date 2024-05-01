module.exports = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    if (req.session.admin) {
        return res.redirect('/');
    }
    next();
}