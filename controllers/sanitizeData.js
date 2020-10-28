const sanitizeHTML = require("sanitize-html")
const flashMessage = require('../helpers/flashmessages')


exports.cleanUp =  function(req, res, next){
    // registration form
    let isValidUrl = true
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
        next()
    }

    //  login form
    else if (req.url === '/login'){
        if ( typeof(req.body.email) != "string" || typeof(req.body.password) != "string"){
            flash(req, res, 'loginErrors', "Please try again", '/')
            }
         // sanitize req.body object
        req.body = {
            email: sanitizeHTML(req.body.email.trim(), {allowedTags: [], allowedAttributes: {} }),
            password: sanitizeHTML(req.body.password, {allowedTags: [], allowedAttributes: {} })
        }
        next()
    }    
    
    else if (req.url === '/recover-password'){
        if ( typeof(req.body.email) != "string"){
            flashMessage(req, res, 'loginErrors', "Please try again", '/')
        }
        req.body = {
            email : sanitizeHTML(req.body.email.trim(), {allowedTags: [], allowedAttributes: {} })
        }
        next()
    }

    // look for /recover-password/reset/(any alpha numeric)
    else if (req.url.match(/^\/recover-password\/reset\/[a-z0-9]+/)){
        if (typeof(req.body.password) != "string" || typeof(req.body.confirmPassword) != "string"){
            flashMessage(req, res, 'errors', "Please try again", `/recover-password/reset/${req.params.token}`)
        }
        req.body = {
            password : sanitizeHTML(req.body.password, {allowedTags: [], allowedAttributes: {} }),
            confirmPassword: sanitizeHTML(req.body.confirmPassword, {allowedTags: [], allowedAttributes: {} })
        }
        next()
    }

   else if (req.url.match(/\/profile\/[a-z0-9A-Z._%+-]+@[a-z0-9A-Z-]+\.[a-z]{2,}\/add-contact/)){
        if (typeof(req.body.firstName) != "string"  || 
            typeof(req.body.lastName) != "string"   ||
            typeof(req.body.email) != "string" ){
                flashMessage(req, res, 'errors', "Unexpected errors, please try again",`/profile/${req.params.email}` )
            }  
 
        req.body = {
            firstName: sanitizeHTML(req.body.firstName.trim(), { allowedTags: [], allowedAttributes:{} }),
            lastName: sanitizeHTML(req.body.lastName.trim(), {allowedTags: [], allowedAttributes: {} }),
            email: sanitizeHTML(req.body.email.trim(), {allowedTags: [], allowedAttributes: {} })
        }
        next()
    }
    else if (req.url.match(/\/profile\/[a-z0-9A-Z._%+-]+@[a-z0-9A-Z-]+\.[a-z]{2,}\/edit-contact/)){
        if (typeof(req.body.firstName) != "string"  || 
            typeof(req.body.lastName) != "string"   ||
            typeof(req.body.currentEmail) != "string" ||
            typeof(req.body.newEmail) != "string"){
                flashMessage(req, res, 'errors', "Unexpected errors, please try again",`/profile/${req.params.email}` )
            }
        req.body = {
            firstName: sanitizeHTML(req.body.firstName.trim(), { allowedTags: [], allowedAttributes:{} }),
            lastName: sanitizeHTML(req.body.lastName.trim(), {allowedTags: [], allowedAttributes: {} }),
            currentEmail: sanitizeHTML(req.body.currentEmail.trim(), {allowedTags: [], allowedAttributes: {} }),
            newEmail: sanitizeHTML(req.body.newEmail.trim(), {allowedTags: [], allowedAttributes: {} })
        } 
        console.log("edit url") 
        next()
    }


   else {
       flashMessage(req,res,'errors', "Something went wrong", '/')
   }
   
}