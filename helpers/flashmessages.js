let flashMessage = function (req, res, type, message, route){
    req.flash(type, message)
    req.session.save( () => res.redirect(route))
}

module.exports = flashMessage