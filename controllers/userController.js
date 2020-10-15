const User = require('../models/User')
const { validationResult } = require('express-validator')




exports.homepage = function(req, res){
    res.send("<h1> home page </h1>")
}



exports.newRegister = function(req, res){
    res.render("register")
}

exports.register = async function(req, res){
    // Errors from validation middleware
    const errorResult = validationResult(req)
   
    // if no error process registrations
    if (errorResult.isEmpty()){
       
        try {
            
            let userObj =  new User(req.body)
            await userObj.register()
            
            res.redirect(`profile/${newUser.email}`) 

        } catch {
            req.flash("errors", "Please try again!")
            req.session.save( () => res.redirect('/register'))
        }
    
    } else {

        errorResult.errors.forEach( error => req.flash('errors', error.msg))
        req.session.save( () => res.redirect('/register')) 
    }

}

exports.viewProfileScreen = async function(req, res){
    try{
        let user =  await User.findUserByEmail(req.params.email)
        res.render('profile', {
                fullname: user.firstName + ' ' + user.lastName,
                email: user.email
                    })
    } catch {
        // set up 404
        res.send("couldnt find user")
    }

}


