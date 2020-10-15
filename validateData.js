const { body } = require('express-validator')
const User = require('./models/User')

exports.validate = function(method){
    switch(method){
        case 'register' :{
            return [
                // first name rules
                body('firstName', 'first name cannot be empty.').exists(),
                body('firstName', 'Only alphabets are allowed in first name').isAlpha(),
                body('lastName', 'First name must be 3 to 25 letters long.').isLength({min: 3, max: 25}),


                // lastname rules 
                body('lastName', 'Last name cannot be empty.').exists(),
                body('lastName', 'Only alphabets are allowed in last name').isAlpha(),
                body('lastName', 'Last name must be 3 to 25 letters long.').isLength({min: 3, max: 25}),

                // password rules
                body('password', 'Password cannot be empty.').exists(),
                body('password', "Password must be a combination of 8 to 25 letters with one uppercase, one lowercase and one number.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/),
                body('password', "Password doesn't match.).equals('confirmpassword"),

                // email rules
                body('email', 'Invalid email address.').isEmail(),
                // check if email aready exist
                body('email').custom( emailId => {
                    return User.findUserByEmail(emailId).then( user =>{
                        if(user){
                            return Promise.reject("Email already in use")
                        }
                    })

                }),

                     
            ]
        } // end of case register
    }
}

