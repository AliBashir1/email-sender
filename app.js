const express  = require('express')
const router = require('./router')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')(session)

require('./config/passport')(passport)


const app = express()


// css and views
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')



// Enables access data from html forms -- boiler plates
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// session setting
let sessionOptions = session({
    secret:'keyboard warrior',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({client: require('./db')}),
    cookie:{
        // 1 sec * 60 * 60 = one hour
        maxAge: 1000 * 60 * 60,
        httpOnly: true
    }

})

app.use(sessionOptions)
app.use(flash())

// passport middle ware
app.use(passport.initialize())
app.use(passport.session())



app.use(function(req, res, next){

    // flash messages
    res.locals.errors = req.flash('errors')
    res.locals.regErrors = req.flash('regErrors')
    res.locals.loginErrors = req.flash('loginErrors')
    res.locals.success = req.flash("success")
    res.locals.contactErrors = req.flash('contactErrors')
    // variables available in ejs templates
    res.locals.user = req.session.user
    
    // if user is in session
    req.visitorId = (req.session.user) ? req.session.user._id : 0

   
    

    next()
})


// routers
app.use('/', router)

module.exports = app



