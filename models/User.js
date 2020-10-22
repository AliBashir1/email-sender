const usersCollection = require('../db').db().collection('users')
const bcrypt = require('bcrypt')

let User = function(data){
    this.data = data
}

User.prototype.register = function (){
    return new Promise( async (resolve, reject)=>{ 
 
        try {
             // delete confirm password from data
            let salt = bcrypt.genSaltSync(10)
            this.data.hashedPassword = bcrypt.hashSync(this.data.password, salt)
            
            // delete extra attributes
            delete this.data.password
            delete this.data.confirmPassword
            
            // commandResult.ops is list of object that carry result of command
            let commandResult = await usersCollection.insertOne(this.data)
            let newUser = commandResult.ops[0]
            delete newUser.hashedPassword
            resolve(newUser)

        } catch (dbErr) {
                console.log("register error\n" + dbErr)
                reject(dbErr)
            }
            
        })

}

User.prototype.login = function(){
    return new Promise( async (resolve, reject) => {
        try {
             // look for user 
            let attemptedUser = await usersCollection.findOne({email: this.data.email})
            /// password comparison
            if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.hashedPassword)){
                delete attemptedUser.hashedPassword
                resolve(attemptedUser)
            } else {
                reject("Invalid password!")
            }
        } catch {
            reject("Invalid email/password")
        }
    })
}


User.findUserByEmail = function(emailId){
    return new Promise( async (resolve, reject)=>{
        if (typeof(emailId) != "string") {
            reject()
            return
        }
        try {
            let user =  await usersCollection.findOne({email: emailId})
            
            if (user){
                delete user.hashedPassword
            }
            resolve(user)
            
        } catch(dbErr) {
            // set up and log for mongodb databse error
            console.log(dbErr)
            reject()
        }
    })
    
}


module.exports = User