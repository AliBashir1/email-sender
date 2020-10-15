const usersCollection = require('../db').db().collection('users')
const bcrypt = require('bcrypt')

let User = function(data){
    this.data = data
}



User.prototype.register = function (){
    return new Promise( async (resolve, reject)=>{ 
        try {
            // delete confirm password from data
            delete this.data.confirmPassword

            let salt = bcrypt.genSaltSync(10)
            this.data.password = bcrypt.hashSync(this.data.password, salt)
            await usersCollection.insertOne(this.data)
            resolve()
            } catch (dbErr) {
                console.log(dbErr)
                reject()
            }
            
        })

}



User.findUserByEmail = function(emailId){
    return new Promise( async (resolve, reject)=>{
        if ( typeof(emailId) != "string"){
            resolve()
            return
        }
        try {
            let user =  await usersCollection.findOne({email: emailId})
            if (user){
                delete user.password
            } 
            resolve(user)
        } catch (dbErr){

            // set up and log for mongodb databse error
            console.log("Database Error \n" +dbErr)
            reject()
        }
    })
    
}


module.exports = User