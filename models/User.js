const usersCollection = require('../db').db().collection('users')
const passwordValidator = require('password-validator')
const emailValidator = require('email-validator');
const e = require('express');



let User = function(data){
    this.data = data;
    this.errors =[]
}

User.prototype.cleanUp = function(){
   
    if( typeof( this.data.email ) != "string") {this.data.email = ""}
    if( typeof( this.data.password ) != "string") {this.data.password = ""}
    if( typeof( this.data.firstName ) != "string") {this.data.firstName = ""}
    if( typeof( this.data.lastName ) != "string") {this.data.lastName = ""}
        
    this.data = {
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        email: this.data.email,
        password: this.data.password
    }
   
}

User.prototype.insertValidationErrors = function(object, errors){


}

User.prototype.validate =  function() {
    return new Promise( async (resolve, reject) => {

        let nameSchema = new passwordValidator()
        let passwordSchema =  new passwordValidator()


        // name rules
        nameSchema
        .is().min(3)                                    // Minimum length 3
        .is().max(50)
        .has().not().digits()

        // firstName and lastName
        let validationErrors =  nameSchema.validate(this.data.firstName, {list:true})
    
        validationErrors.forEach( (errorType) => {
        
            if (errorType == 'min'){ this.errors.push("First name must be atleast 3 characters.")}
            if (errorType == 'max'){ this.errors.push("First name cannot exceed 25 characters.")}
            if (errorType == 'digits'){ this.errors.push("First name cannot be digits.")}
            
        })

        validationErrors =  nameSchema.validate(this.data.lastName, {list:true})

        validationErrors.forEach( (errorType) => {
                if (errorType == 'min'){ this.errors.push("Last name must be atleast 3 characters.")}
                if (errorType == 'max'){ this.errors.push("Last name cannot exceed 25 characters.")}
                if (errorType == 'digits'){ this.errors.push("Last name cannot be digits.")}
        
            })



            // password rules
        passwordSchema
            .is().min(8)                                    // Minimum length 8
            .is().max(25)                                   // Maximum length 25
            .has().uppercase()                              // Must have uppercase letters
            .has().lowercase()                              // Must have lowercase letters
            .has().digits(2)                               // Must have at least 2 digits


            // email validations 
        let isValidEmail  = emailValidator.validate(this.data.email)
        if(!isValidEmail){ this.errors.push("Please enter valid email.") }

        let passwordValid = passwordSchema.validate(this.data.password, {list:true})

        passwordValid.forEach( (errorType) => {
            if (errorType == 'min'){ this.errors.push("Password must be atleast 8 characters.")}
            if (errorType == 'max'){ this.errors.push("Password cannot exceed 25 characters.")}
            if (errorType == 'lowercase'){ this.errors.push("Password must contain atleast one lowercase character.")}
            if (errorType == 'uppercase'){ this.errors.push("Password must contain atleast one uppercase character.")}
            if (errorType == 'digits'){ this.errors.push("Password must include 2 digits")}
        })

        if(!this.errors){
            let emailExists =  await usersCollection.findOne({email: this.data.email})
            if (emailExists) {this.errors.push("That email is already exists.")}
        }
        


})}

    





User.prototype.register = function (){
  return new Promise( async (resolve, reject)=>{
    try {
      
      this.cleanUp()
      this.validate()

      // await usersCollection.insertOne(this.data)
      resolve()
      } 
    catch (databaseError) {
          console.log(databaseError)
          reject(databaseError)
    }
    
})

}


module.exports = User