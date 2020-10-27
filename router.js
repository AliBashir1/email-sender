const express = require('express')
const router = express.Router()
const sanitizeData= require('./controllers/sanitizeData')
const validateData = require("./models/validateData")
const password = require("./controllers/password")
const passport = require('passport')

// controllers
const userController = require('./controllers/userController')



// users routes
router.get('/', userController.homepage)
router.post('/register', sanitizeData.cleanUp, validateData.validateRegistration, userController.register)
router.post('/login', sanitizeData.cleanUp, validateData.validateLoginEmail, userController.login)
router.get('/profile/:email',userController.viewProfileScreen)
router.post('/logout', userController.logout )

// password recovery
router.post('/recover-password', sanitizeData.cleanUp, validateData.validateLoginEmail, password.recover)
router.get('/recover-password/reset/:token', password.reset)
router.post('/recover-password/reset/:token',sanitizeData.cleanUp, validateData.validateResetPassword,  password.resetPassword)


// //  google auth
// //  @desc Auth with google
// //  @route /google
// router.get('/google', passport.authenticate('google', { scope: [ 'profile' ] }))

// // @desc Google auth callback
// // @route /google/callback
// router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
//     console.log("i am here ")
//     res.redirect('/')
// })


module.exports = router