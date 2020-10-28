const { ContextReplacementPlugin } = require('webpack')
const { ObjectID } = require('mongodb')

const contactsCollection = require('../db').db().collection('contacts')

let Contact = function(data){
    
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.email = data.email
    this.addedBy=  new ObjectID(data.addedBy)
    this.createdDate = Date.now()


}

Contact.prototype.addContact = function(){
    return new Promise( async (resolve, reject)=>{
        try {
            await contactsCollection.insertOne(this)
            resolve()
        } catch { 
            reject () 
        }       
    })
}

Contact.prototype.update = function(contactId, ownerId){
    return new Promise( async (resolve, reject) => {
        try{
           let results = await contactsCollection.findOneAndUpdate(
                {_id: new ObjectID(contactId), addedBy: new ObjectID(ownerId) },
                {$set: {firstName: this.firstName, lastName: this.lastName, email: this.email, lastUpdate: Date.now()}}
                )
            let status = results.lastErrorObject.updatedExisting
            resolve(status)
        } catch(error) {
            reject(false)
        }
    })
}

Contact.deleteContact = function(contactId, ownerId){
    return new Promise( async (resolve, reject) => {
        try {
            let result = await contactsCollection.findOneAndDelete(
                {_id: new ObjectID(contactId), addedBy: new ObjectID(ownerId)}
                ) 

            (result.lastErrorObject.n > 0) ? resolve() : reject()

        } catch { reject() }   
    })
}

// used in validation
Contact.findContactByEmail = function(email){
    return new Promise( async (resolve, reject) => {
        try {
            let contact = await contactsCollection.findOne({email: email})
            resolve(contact)
        } catch (dbErr){ reject() }   
    })
}

Contact.findContactsByOwnerID = function(ownerId){
    return new Promise(async (resolve, reject)=>{
        let contacts
        try{
            let result =  await contactsCollection.find(
                {addedBy: new ObjectID(ownerId) }
            ).toArray()
            
            if (result){
                contacts =result.map((contact)=>{
                        contact = {
                            firstName: contact.firstName,
                            lastName: contact.lastName,
                            email: contact.email,
                            c_id:"c-" + String(contact._id).slice(6,12),
                            _id:contact._id
                        }
                        
                    return contact
                })
            }
            resolve(contacts)
        } catch {
            reject()
        }
    })
}

module.exports = Contact
