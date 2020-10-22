const User = require('../models/User')
const { validationResult } = require('express-validator')

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
        
        try{
            let newUser = await userObj.register()
            req.session.user = newUser
            req.session.user.authenticated = true
            req.session.save(()=>{
                res.redirect(`profile/${newUser.email}`)
            })

        } catch (error) {
            req.flash("regErrors", "Something went wrong, please try again.")
            req.session.save( () => res.redirect('/'))
        }
    
    } else {
        errorResult.errors.forEach( error => req.flash('regErrors', error.msg))
        req.session.save( () => res.redirect('/')) 
    }

}
exports.login = async function(req, res){
    const errorResult = validationResult(req)
    
    if (errorResult.isEmpty()){
        let userObj = new User(req.body)
        try{
            let attemptedUser = await userObj.login()
            req.session.user = attemptedUser
            req.session.user.authenticated = true
            req.session.save(()=>{
                res.redirect(`profile/${attemptedUser.email}`)
            })
            

        } catch(error) {
            // invalid password- error
            req.flash("loginErrors", error) 
            req.session.save( () => res.redirect('/'))
        }
    
    } else {
        errorResult.errors.forEach( error => req.flash('loginErrors', error.msg))
        req.session.save( () => res.redirect('/') )
    }
}

exports.viewProfileScreen = function(req, res){

    if(req.session.user){
        res.render('profile',{ 
            fullname: req.session.user.firstName +" "+ req.session.user.lastName,
            email: req.session.user.email
        })
    } else {
        req.flash("errors", "Please log in!!")
        req.session.save(() => res.redirect('/') )
    }
   
    }

// check user's ownership 
exports.isUserAuthenticated = async function(req, res, next){
    console.log(req.params)
    // user just logged in or registered are authenticated already
    if (req.session.user){
        console.log("inside req.session.user if")
        if (req.session.user.authenticated){
            req.session.user.authenticated = false
            next()
            return
        }

        try {
            // look for user 
            let attemptedUser = await User.findUserByEmail(req.params.email)
            console.log(attemptedUser)

            //  if user exists
            if (attemptedUser && req.visitorId == attemptedUser._id){
                console.log("inside attemptedUser if")
        
                next()
            } else {
                console.log("inside attemptedUser else")
                // if use try to access other user account
                delete req.session.user 
                // user is not owner of profile
                req.flash("errors", "You are not allowed in this url.")
                req.session.save(()=> res.redirect('/'))
            }
            // user doesn't exits in databasex
            
            
            
        } catch{ 
            // database error
            console.log("inside catch ")
            req.flash('errors', "Something went wrong, Please try again.")
            req.session.save(()=> res.redirect('/'))

        }

    } else { 
        console.log("inside req.session.user else")
        // user is not logged in
        req.flash("errors", "You must be logged in.")
        req.session.save(()=> res.redirect('/'))
    }

}

exports.logout = function (req, res){
    req.session.destroy(
        res.redirect('/')
    )

  
}


