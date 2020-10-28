let flashMessage = function (req, res, type, message, route){
    if (typeof (message) == 'object'){
        message.forEach(error => req.flash(type, error.msg))
    } else {
        req.flash(type, message)
    }
    
    req.session.save( () => res.redirect(route))
}

module.exports = flashMessage