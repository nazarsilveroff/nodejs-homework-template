const {Schema, model} = require('mongoose');

const contactsShema = new Schema({
    "name": {
        "type": String,
        "required": [true, 'Set name for contact'],
    },
    "email": {
        "type": String,
    },
    "phone": {
        "type": String,
    },
    "favorite": {
        "type": Boolean,
        "default": false,
    }
})

const contactsModel = model("Contact", contactsShema)
exports.contactsModel = contactsModel