const { body } = require("express-validator")
const User = require("./User")
const Contact = require("./Contact")

exports.validateRegistration = [
  body("firstName", "first name must be 3 to 25 letters long, only letters allowed.").exists().isAlpha().isLength({ min: 3, max: 25 }),
  body("lastName", "last name must be 3 to 25 letters long, only letters allowed.").exists().isAlpha().isLength({ min: 3, max: 25 }),
  body("password", '"Password must be a combination of 8 to 25 letters with one uppercase, one lowercase and one number."')
    .exists()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/),
  body("password", "Password cannot be empty.").exists(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password")
    } else {
      return true
    }
  }),
  body("email", "Please provide valid email address").isEmail(),
  body("email").custom(emailId => {
    return User.findUserByEmail(emailId).then(user => {
      if (user) {
        return Promise.reject("Email is already in use.")
      }
    })
  })
]

// loginForm
exports.validateLoginEmail = [
  body("email", "Invalid email address.").isEmail(),
  body("email").custom(emailId => {
    return User.findUserByEmail(emailId).then(user => {
      if (!user) {
        return Promise.reject("Email does not exists!")
      }
    })
  })
]

exports.validateResetPassword = [
  body("password", '"Password must be a combination of 8 to 25 letters with one uppercase, one lowercase and one number."')
    .exists()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/),
  body("confirmPassword", '"Password must be a combination of 8 to 25 letters with one uppercase, one lowercase and one number."')
    .exists()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password")
    } else {
      return true
    }
  })
]

exports.validateContactForm = [
  body("firstName", "first name must be 3 to 25 letters long, only letters allowed.").exists().isAlpha().isLength({ min: 3, max: 25 }),
  body("lastName", "last name must be 3 to 25 letters long, only letters allowed.").exists().isAlpha().isLength({ min: 3, max: 25 }),
  body("email", "Please provide valid email address").isEmail(),
  // check if email aready exist

  body("email").custom((emailId, { req }) => {
    return Contact.findContactByEmail(emailId).then(contact => {
      if (contact) {
        if (req.session.user._id == contact.addedBy) {
          return Promise.reject("Contact is already in contact list.")
        }
      }
    })
  })
]

exports.validateEditContactForm = [
  body("firstName", "first name must be 3 to 25 letters long, only letters allowed.").exists().isAlpha().isLength({ min: 3, max: 25 }),
  body("lastName", "last name must be 3 to 25 letters long, only letters allowed.").exists().isAlpha().isLength({ min: 3, max: 25 }),
  body("newEmail", "Please provide valid email address").isEmail(),
  body("currentEmail", "Please provide valid email address").isEmail(),

  body("newEmail").custom((emailId, { req }) => {
    return Contact.findContactByEmail(emailId).then(contact => {
      if (contact) {
        if (req.session.user._id == contact.addedBy) {
          return Promise.reject("Contact is already in contact list.")
        }
      }
    })
  }),

  body("newEmail").custom((value, { req }) => {
    if (value == req.body.currentEmail) {
      throw new Error("Please provide new email address.")
    } else {
      return true
    }
  })
]
