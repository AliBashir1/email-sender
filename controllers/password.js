const User = require("../models/User")
const sgMail = require("@sendgrid/mail")
const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator")
const flashMessage = require("../helpers/flashmessages")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/**
 * Summary.
 *      Find the user using email using the "User" model method that will generate a temporary token to be used as a recovery link
 *      and send it user via email.
 * @route /recover-password
 * @access public
 * @param {*} req
 * @param {*} res
 */

exports.recover = async function (req, res) {
  const errorResult = validationResult(req)
  if (errorResult.isEmpty()) {
    try {
      let attemptedUser = await User.findAndGenerateResetTK(req.body.email)

      if (!attemptedUser) {
        flashMessage(req, res, "errors", "Email doesn't exist, Please double check email.", "/recover-password")
      }

      // create link and send email
      let link = "http://" + req.headers.host + "/recover-password/reset/" + attemptedUser.resetPasswordToken
      const mailOptions = {
        to: attemptedUser.email,
        from: process.env.FROM_EMAIL,
        subject: "Password change request",
        text: `Hi ${attemptedUser.firstName}\n Please click on the following link ${link} to reset your password.\n\tIf you did not request this, please ignore this email and your password will remain unchanged.\n`
      }
      // send email
      try {
        await sgMail.send(mailOptions)
        flashMessage(req, res, "success", `A password recovery email have sent to ${attemptedUser.email}, please check your email.`, "/")
      } catch (error) {
        flashMessage(req, res, "errors", "There was a problem sending recovery email, Please try again", "/recover-password")
      }
    } catch (err) {
      flashMessage(req, res, "errors", "Please try again", "/recover-password")
    }
  } else {
    flashMessage(req, res, "contactErrors", errorResult.errors, `/profile/${req.params.email}/`)
  }
}

/**
 * Summary.
 *      Finds user by using token from url and render "reset" html page.
 *
 * @route /recover-password/reset/:token
 * @param {*} req
 * @param {*} res
 */
exports.reset = async function (req, res) {
  try {
    let attemptedUser = await User.findUserByToken(req.params.token)
    if (!attemptedUser) {
      flashMessage(req, res, "errors", "Password reset token is invalid or has expired.", "/")
    } else {
      res.render("reset", { attemptedUser: attemptedUser })
    }
  } catch {
    flashMessage(req, res, "errors", "Password reset token is invalid or has expired.", "/")
  }
}

/**
 * Summary.
 *      Finds user using token from url.
 * @route /recover-password/token/:token
 * @param {*} req
 * @param {*} res
 */
exports.resetPassword = async function (req, res) {
  const errorResult = validationResult(req)
  if (errorResult.isEmpty()) {
    try {
      let modifiedUser = await User.findUserByTkAndUpdatePassword(req.params.token, req.body.password)
      if (!modifiedUser) {
        flashMessage(req, res, "errors", "Password reset token is invalid or has expired.", "/")
      }

      // send email
      try {
        const mailOptions = {
          to: modifiedUser.email,
          from: process.env.FROM_EMAIL,
          subject: "Password changed",
          text: `Hi ${modifiedUser.firstName}, This is a confirmation that the password for your account ${modifiedUser.email} has just been changed.\n`
        }
        // send email
        await sgMail.send(mailOptions)
        flashMessage(req, res, "success", `Pass have been updated for ${modifiedUser.email}, please check your email for confirmation.`, "/")
      } catch (mailErr) {
        flashMessage(req, res, "error", "There was a problem sending confirmation email, Please try again", "/")
      }
    } catch (err) {}
  } else {
    flashMessage(req, res, "contactErrors", errorResult.errors, `/profile/${req.params.email}/`)
  }
}
