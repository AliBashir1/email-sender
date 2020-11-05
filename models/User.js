const usersCollection = require("../db").db().collection("users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

let User = function (data) {
  this.firstName = data.firstName
  this.lastName = data.lastName
  this.email = data.email
  this.password = data.password
  this.resetPasswordToken
  this.resetPasswordExpires
}

/**
 * Summary.
 *
 * @return {Promise}
 */
User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let salt = bcrypt.genSaltSync(10)
      this.hashedPassword = bcrypt.hashSync(this.password, salt)
      delete this.password

      // commandResult.ops is list of object that carry result of command
      let commandResult = await usersCollection.insertOne(this)

      let key = String(commandResult.ops[0].firstName).concat(commandResult.ops[0].email)
      let newUser = {
        firstName: commandResult.ops[0].firstName,
        lastName: commandResult.ops[0].lastName,
        email: commandResult.ops[0].email,
        _id: attemptedUser._id,
        authenticationKey: bcrypt.hashSync(key, salt)
      }

      resolve(newUser)
    } catch (dbErr) {
      console.log("register error\n" + dbErr)
      reject(dbErr)
    }
  })
}

User.prototype.login = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let attemptedUser = await usersCollection.findOne({ email: this.email })
      if (attemptedUser && bcrypt.compareSync(this.password, attemptedUser.hashedPassword)) {
        delete attemptedUser.hashedPassword
        // encrypted authentication key
        let salt = bcrypt.genSaltSync(10)
        let key = attemptedUser.firstName.concat(attemptedUser.email)
        let newUser = {
          firstName: attemptedUser.firstName,
          lastName: attemptedUser.lastName,
          email: attemptedUser.email,
          _id: attemptedUser._id,
          authenticationKey: bcrypt.hashSync(key, salt)
        }
        resolve(newUser)
      } else {
        reject("Invalid password!")
      }
    } catch {
      reject("Invalid email/password")
    }
  })
}

User.findUserByEmail = function (emailId) {
  return new Promise(async (resolve, reject) => {
    if (typeof emailId != "string") {
      reject()
      return
    }
    try {
      let user = await usersCollection.findOne({ email: emailId })
      if (user) {
        delete user.hashedPassword
      }
      resolve(user)
    } catch (dbErr) {
      // set up and log for mongodb databse error
      console.log(dbErr)
      reject()
    }
  })
}

User.findAndGenerateResetTK = function (email) {
  return new Promise(async (resolve, reject) => {
    let token = crypto.randomBytes(20).toString("hex")
    let tokenExpires = Date.now() + 1000 * 60 * 60

    try {
      let result = await usersCollection.findOneAndUpdate({ email: email }, { $set: { resetPasswordToken: token, resetPasswordExpires: tokenExpires } })

      // clean up user -- findOneAndupdate return previous values- thats I used updated Token
      user = {
        firstName: result.value.firstName,
        lastName: result.value.lastName,
        email: result.value.email,
        resetPasswordToken: token
      }

      resolve(user)
    } catch (err) {
      console.log(err)
      reject()
    }
  })
}
/**
 * updates token in database
 */

// find user by token and update password right away
// boolean for updating password if yes than up

User.findUserByTkAndUpdatePassword = function (token, password) {
  return new Promise(async (resolve, reject) => {
    try {
      let hashedPassword = await bcrypt.hashSync(password, bcrypt.genSaltSync(10))

      let result = await usersCollection.findOneAndUpdate({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, { $set: { resetPasswordToken: undefined, resetPasswordExpires: undefined, hashedPassword: hashedPassword } })

      user = {
        firstName: result.value.firstName,
        lastName: result.value.lastName,
        email: result.value.email
      }
      resolve(user)
    } catch (err) {
      console.log(err)
      reject()
    }
  })
}

User.findUserByToken = function (token) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await usersCollection.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
      if (user) {
        delete user.hashedPassword
      }
      resolve(user)
    } catch (dbErr) {
      console.log(err)
      reject()
    }
  })
}

module.exports = User
