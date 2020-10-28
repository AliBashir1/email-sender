const Contact = require('../models/Contact')
const flashMessage = require('../helpers/flashmessages')
const { validationResult } = require('express-validator')


exports.addContact =  async function(req, res){
    const errorResult = validationResult(req)
    if (errorResult.isEmpty()){
        try{
            // set up contact object
            newContact = {
                firstName: req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email,
                addedBy: req.session.user._id
            }
            let contact = new Contact(newContact)
            await contact.addContact()
            flashMessage(req, res, 'success', "New contact added.", `/profile/${req.params.email}/`)
        } catch {
            flashMessage(req, res, 'errors', "Something went wrong, Please try again", `/profile/${req.params.email}/`)
        }
    } else {
        // errorResult return list of objects will error msg
        flashMessage(req, res, 'errors',  errorResult.errors, `/profile/${req.params.email}/`)
    }
}

exports.editContact = async function (req, res){
    const errorResult = validationResult(req)
    if(errorResult.isEmpty()){
        try {
            newContact = {
                firstName: req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.newEmail  
            }
            let contact = new Contact(newContact)
            let status = await contact.update(req.params.contactId, req.session.user._id)
            if(status){ 
            flashMessage(req, res, "success", "Contact is updated", `/profile/${req.session.user.email}/`)
        } else {
            flashMessage(req, res, "errors", "Contact couldn't be update, Please try again", `/profile/${req.session.user.email}/`)
        }
        } catch{}
        
    }else{
        flashMessage(req, res, 'errors',  errorResult.errors, `/profile/${req.params.email}/`)
    }
}

exports.deleteContact = async function (req, res){
    try{
        await Contact.deleteContact(req.params.contactId, req.session.user._id)
        flashMessage(req, res, 'warning', "Contact Deleted!", `/profile/${req.session.user.email}/`)
    } catch{
        flashMessage(req, res, 'errors', "Sorry! unable to delete contact." `/profile/${req.session.user.email}/`)
    }
   
}



   

