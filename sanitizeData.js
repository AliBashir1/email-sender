const sanitizeHTML = require("sanitize-html")


exports.cleanUp = function(method){
    return function(req, res , next){

        // sanitize input field according to forms (register or log)
        switch(method){
            case 'register' : {
                if (typeof(req.body.firstName) != "string" || typeof(req.body.lastName) != "string" ||
                    typeof(req.body.email) != "string" || typeof(req.body.password) != "string" ||
                    typeof(req.body.confirmPassword) != "string"){
                        
                        req.flash("errors", "Please try again")
                        req.session.save( ()=> res.redirect('/register'))
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
        }
        next()
    }
}