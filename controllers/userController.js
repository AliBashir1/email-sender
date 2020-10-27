const User = require('../models/User')
const { validationResult } = require('express-validator')
const flashMessage = require('../helpers/flashmessages')


exports.homepage = function(req, res){
    if(req.session.user){
        res.redirect(`/profile/${req.session.user.email}`)
    } else {
        res.render("homepage")
    }
   
}

exports.register = async function(req, res){
    
    // Errors from validation middleware
    const errorResult = validationResult(req)
    
    // if no error process registrations
    if (errorResult.isEmpty()){
        let userObj =  new User(req.body)
        
        try {
            let newUser = await userObj.register()
            req.session.user = newUser
            req.session.user.authenticated = true
            req.session.save(()=>{
                res.redirect(`profile/${newUser.email}`)
            })

        } catch (error) { 
            flashMessage(req, res, 'regErrors', "Something went wrong, please try again.", '/') 
        }
        
    } else { 
        errorResult.errors.forEach(error => flashMessage(req, res, 'regErrors', error.msg, '/')) 
    }

}
exports.login = async function(req, res){
    
    const errorResult = validationResult(req)
    if (errorResult.isEmpty()){
        let userObj = new User(req.body)
        try {
            let attemptedUser = await userObj.login()
            req.session.user = attemptedUser
            req.session.user.authenticated = true
            req.session.save(()=>{
                res.redirect(`profile/${attemptedUser.email}`)
            })
            
        } catch(error) { 
            flashMessage(req, res, 'loginErrors', error, '/') 
        }
    
    } else { 
        errorResult.errors.forEach(error => flashMessage(req, res, 'loginErrors', error.msg, '/')) 
    }
}

exports.viewProfileScreen = function(req, res){

    if(req.session.user){
        res.render('profile',{ 
            fullname: req.session.user.firstName +" "+ req.session.user.lastName,
            email: req.session.user.email
        })
    } else {
        flashMessage(req, res, 'errors', "Please log in!", '/')
    }  
}

// check user's ownership 
exports.isUserAuthenticated = async function(req, res, next){
    console.log(req.params)
    // user just logged in or registered are authenticated already
    if (req.session.user){
        
        if (req.session.user.authenticated){
            req.session.user.authenticated = false
            next()
            return
        }

        try {
            // look for user 
            let attemptedUser = await User.findUserByEmail(req.params.email)

            //  if user exists
            if (attemptedUser && req.visitorId == attemptedUser._id){
                next()
            } else {
                // if use try to access other user account
                delete req.session.user 
                // user is not owner of profile
                flashMessage(req, res, 'errors', "You are not allowed in this url.", '/')

            }
            // user doesn't exits in databasex
 
        } catch{ 
            // database error
            flashMessage(req, res, 'errors', "Something went wrong, Please try again.", '/')
        }

    } else { 
        // user is not logged in
        flashMessage(req, res, 'errors', "Please log in ", '/')
    }

}

exports.logout = function (req, res){
    req.session.destroy(
        res.redirect('/')
    )

  
}



