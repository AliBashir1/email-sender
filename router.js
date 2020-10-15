const express = require('express')
const router = express.Router()
const sanitizeData= require('./sanitizeData')
const validateData = require("./validateData")

// controllers
const userController = require('./controllers/userController')


// users routes
router.get('/', userController.homepage)
router.get('/register', userController.newRegister)
router.post('/register', sanitizeData.cleanUp('register'), validateData.validate('register'), userController.register)
router.get('/profile/:email', userController.viewProfileScreen)


module.exports = router