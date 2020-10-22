const sanitizeHTML = require("sanitize-html")


exports.cleanUp =  function(req, res, next){
    
    // registration form
    if (req.url === '/register'){
     
        if (typeof(req.body.firstName) != "string" || typeof(req.body.lastName) != "string" ||
            typeof(req.body.email) != "string" || typeof(req.body.password) != "string" ||
            typeof(req.body.confirmPassword) != "string"){
                req.flash("regErrors", "Please try again!!")
                req.session.save( ()=> res.redirect('/'))
            }
                   
            // sanitize req.body object
            req.body = {
                firstName: sanitizeHTML(req.body.firstName.trim(), { allowedTags: [], allowedAttributes:{} }),
                lastName: sanitizeHTML(req.body.lastName.trim(), {allowedTags: [], allowedAttributes: {} }),
                email: sanitizeHTML(req.body.email.trim(), {allowedTags: [], allowedAttributes: {} }),
                password: sanitizeHTML(req.body.password, {allowedTags: [], allowedAttributes: {} }),
                confirmPassword: sanitizeHTML(req.body.confirmPassword, {allowedTags: [], allowedAttributes: {} })
            }
    }

    //  login form
    if (req.url === '/login'){
        if ( typeof(req.body.email) != "string" || typeof(req.body.password) != "string"){
            req.flash("loginErrors", "Please try again")
            req.session.save( ()=> res.redirect('/'))
            }
         // sanitize req.body object
        req.body = {
            email: sanitizeHTML(req.body.email.trim(), {allowedTags: [], allowedAttributes: {} }),
            password: sanitizeHTML(req.body.password, {allowedTags: [], allowedAttributes: {} })
        }

    }     
    
    next()
}