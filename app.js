const express  = require('express')
const router = require('./router')
const session = require('express-session')
const flash = require('connect-flash')
const connectMongo = require('connect-mongo')

const app = express()


// css and views
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

// session setting

let sessionOptions = session({
    secret:'keyboard warrior',
    resave: false,
    saveUninitialized: false,

    cookie:{
        // 1 sec * 60 * 60 = one hour
        maxAge: 1000 * 60 * 60,
        httpOnly: true
    }

})


// Enables access data from html forms -- boiler plates
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(flash())
app.use(sessionOptions)

app.use(function(req, res, next){
    res.locals.errors = req.flash('errors')
    // res.locals.success = req.flash("success")
    next()
})
// routers
app.use('/', router)

module.exports = app



