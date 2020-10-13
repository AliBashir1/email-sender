const express  = require('express')
const router = require('./router')



const app = express()
    // css and views
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

// Enables access data from html forms -- boiler plates
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// routers
app.use('/', router)

module.exports = app



