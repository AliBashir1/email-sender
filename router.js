const express = require('express')
const router = express.Router()
const sanitizeData= require('./controllers/sanitizeData')
const validateData = require("./models/validateData")

// controllers
const userController = require('./controllers/userController')



// users routes
router.get('/', userController.homepage)
router.post('/register', sanitizeData.cleanUp, validateData.validateRegistration, userController.register)
router.post('/login', sanitizeData.cleanUp,validateData.validateLogin, userController.login)
router.get('/profile/:email',userController.viewProfileScreen)
router.post('/logout', userController.logout )



module.exports = router