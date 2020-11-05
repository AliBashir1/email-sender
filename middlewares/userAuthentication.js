const flashMessage = require("../helpers/flashmessages")
const User = require("../models/User")
const bcrypt = require("bcrypt")

/**
 * Summary.
 *      This is a middleware to make sure user's authentication.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
let isUserAuthenticated = async function (req, res, next) {
  // user just logged in or registered are authenticated already
  if (req.session.user) {
    let attemptedUser = await User.findUserByEmail(req.params.email)
    let key = String(attemptedUser.firstName).concat(attemptedUser.email)

    if (req.session.user._id == attemptedUser._id && bcrypt.compareSync(key, req.session.user.authenticationKey)) {
      console.log("authenticated ")
      next()
      return
    } else {
      // if use try to access other user account and user is not owner of profile
      delete req.session.user
      flashMessage(req, res, "errors", "You are not allowed in this url.", "/")
    }
  } else {
    // user is not logged in
    flashMessage(req, res, "errors", "Please log in ", "/")
  }
}

module.exports = isUserAuthenticated
