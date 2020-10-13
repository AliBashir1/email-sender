const express = require('express')
const router = express.Router()

// controllers
const userController = require('./controllers/userController')


// users routes
router.get('/', userController.homepage)
router.get('/register', userController.newRegister)
router.post('/register', userController.register)


module.exports = router