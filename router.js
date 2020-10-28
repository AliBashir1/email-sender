const express = require('express')
const router = express.Router()
const sanitizeData= require('./controllers/sanitizeData')
const validateData = require("./models/validateData")
const password = require("./controllers/password")
const passport = require('passport')
const isUserAuthenticated = require('./middlewares/userAuthentication')

// controllers
const userController = require('./controllers/userController')
const contactController = require('./controllers/contactController')



// users routes
router.get('/', userController.homepage)
router.post('/register', sanitizeData.cleanUp, validateData.validateRegistration, userController.register)
router.post('/login', sanitizeData.cleanUp, validateData.validateLoginEmail, userController.login)
router.get('/profile/:email', isUserAuthenticated,  userController.viewProfileScreen)
router.post('/logout', userController.logout )

// password recovery
router.post('/recover-password', sanitizeData.cleanUp, validateData.validateLoginEmail, password.recover)
router.get('/recover-password/reset/:token', password.reset)
router.post('/recover-password/reset/:token', sanitizeData.cleanUp, validateData.validateResetPassword,  password.resetPassword)


// contacts routes
router.post('/profile/:email/add-contact', isUserAuthenticated, sanitizeData.cleanUp, validateData.validateContactForm, contactController.addContact)
router.post('/profile/:email/edit-contact/:contactId',isUserAuthenticated, sanitizeData.cleanUp, validateData.validateEditContactForm, contactController.editContact)
router.post('/profile/:email/delete-contact/:contactId', isUserAuthenticated, contactController.deleteContact)


module.exports = router