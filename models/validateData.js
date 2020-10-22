const { body } = require('express-validator')
const User = require('./User')


exports.validateRegistration = [
    // first name rules
    body('firstName', 'first name must be 3 to 25 letters long, only letters allowed.').exists().isAlpha().isLength({min: 3, max: 25}),

    // lastname rules 
    body('lastName', 'last name must be 3 to 25 letters long, only letters allowed.').exists().isAlpha().isLength({min: 3, max: 25}),

    // password rules
    body('password', '"Password must be a combination of 8 to 25 letters with one uppercase, one lowercase and one number."').exists().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/),
    body('password', "Password cannot be empty.").exists(),
    body('confirmPassword', "Password doesn't match.").exists().not().equals('password'),

    // email rules
    body('email', 'Please provide valid email address').isEmail(),
    // check if email aready exist

    body('email').custom( (emailId) => {
        return User.findUserByEmail(emailId).then( user =>{
            if(user){
                return Promise.reject("Email is already in use.")
            }
        })

    }),
    
    ]

// registeration form
exports.validateLogin  = [
    body('email', 'Invalid email address.').isEmail(),
    body('email').custom( emailId => {
        return User.findUserByEmail(emailId).then( user =>{
            if(!user){
                return Promise.reject("Email does not exists!")
            }
        })
    }),
    
]


