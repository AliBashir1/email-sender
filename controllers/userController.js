const User = require('../models/User')
const Contact = require('../models/Contact')
const { validationResult } = require('express-validator')
const flashMessage = require('../helpers/flashmessages')
const bcrypt = require('bcrypt')


/**
 * Summary.
 *      It will redirect based on user's login status.
 * @route '/'
 * @method GET
 * @param {*} req 
 * @param {*} res 
 */

exports.homepage = function(req, res){
    if(req.session.user){
        res.redirect(`/profile/${req.session.user.email}`)
    } else {
        res.render("homepage")
    }
   
}


/**
 * Summary.
 *      Routes the user to its profile if no error found in input data.
 * 
 * @route '/register'
 * @method POST
 * @param {*} req 
 * @param {*} res 
 */
exports.register = async function(req, res){
    
    // Errors from validation middleware
    const errorResult = validationResult(req)
    
    // if no error process registrations
    if (errorResult.isEmpty()){
        let userObj =  new User(req.body)
        
        try {
            let newUser = await userObj.register()
            req.session.user = newUser
            req.session.save(()=>{
                res.redirect(`profile/${newUser.email}`)
            })

        } catch (error) { 
            flashMessage(req, res, 'regErrors', "Something went wrong, please try again.", '/') 
        }
        
    } else { 
        flashMessage(req, res, 'contactErrors',  errorResult.errors, `/profile/${req.params.email}/`)
    }

}


/**
 * Summary.
 *      If no error found, it will redirect the user to its profile and save session as well.
 * 
 * @route '/login'
 * @method POST    
 * @param {*} req 
 * @param {*} res 
 */
exports.login = async function(req, res){
    
    const errorResult = validationResult(req)
    if (errorResult.isEmpty()){
        let userObj = new User(req.body)
        try {
            let attemptedUser = await userObj.login()
            req.session.user = attemptedUser
            req.session.save(()=>{
                res.redirect(`profile/${attemptedUser.email}`)
            })
            
        } catch(error) { 
            flashMessage(req, res, 'loginErrors', error, '/') 
        }
    
    } else { 
        flashMessage(req, res, 'contactErrors',  errorResult.errors, `/profile/${req.params.email}/`)
    }
}


/**
 * Summary.
 *      Renders user's Profile.
 * 
 * @route '/profile/:email'
 * @method GET
 * @param {*} req 
 * @param {*} res 
 */

exports.viewProfileScreen = async function(req, res){
    if(req.session.user){
        try{
            let contacts = await Contact.findContactsByOwnerID(req.session.user._id)
            res.render('profile',{ 
                fullname: req.session.user.firstName +" "+ req.session.user.lastName,
                email: req.session.user.email,
                id: req.session.user._id,
                contacts: contacts
            })
        } catch(err){
            console.log(err)
        }
  
    } else {
        flashMessage(req, res, 'errors', "Please log in!", '/')
    }  
}


exports.logout = function (req, res){
    req.session.destroy(
        res.redirect('/')
    )

  
}



