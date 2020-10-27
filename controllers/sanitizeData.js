const sanitizeHTML = require("sanitize-html")
const flashMessage = require('../helpers/flashmessages')


exports.cleanUp =  function(req, res, next){
    let alphaNumerc = /^[a-z0-9]+$/i
    // registration form
    if (req.url === '/register'){
     
        if ( typeof(req.body.firstName) != "string"  || 
            typeof(req.body.lastName) != "string"   ||
            typeof(req.body.email) != "string"      || 
            typeof(req.body.password) != "string"   ||
            typeof(req.body.confirmPassword) != "string") {
                flashMessage(req, res, 'regErrors', "Please try again", '/')
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
            flash(req, res, 'loginErrors', "Please try again", '/')
            }
         // sanitize req.body object
        req.body = {
            email: sanitizeHTML(req.body.email.trim(), {allowedTags: [], allowedAttributes: {} }),
            password: sanitizeHTML(req.body.password, {allowedTags: [], allowedAttributes: {} })
        }
    }    
    
    if (req.url === '/recover-password'){
        if ( typeof(req.body.email) != "string"){
            flashMessage(req, res, 'loginErrors', "Please try again", '/')
        }
        req.body = {
            email : sanitizeHTML(req.body.email.trim(), {allowedTags: [], allowedAttributes: {} })
        }
    }

    // look for /recover-password/reset/(any alpha numeric)
    if (req.url.match(/^\/recover-password\/reset\/[a-z0-9]+/)){
        if (typeof(req.body.password) != "string" || typeof(req.body.confirmPassword) != "string"){
            flashMessage(req, res, 'errors', "Please try again", `/recover-password/reset/${req.params.token}`)
        }
        req.body = {
            password : sanitizeHTML(req.body.password, {allowedTags: [], allowedAttributes: {} }),
            confirmPassword: sanitizeHTML(req.body.confirmPassword, {allowedTags: [], allowedAttributes: {} })
        }
       
    }
    next()
}