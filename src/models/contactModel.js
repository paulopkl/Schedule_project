const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: false,
        default: ''
    },
    email: {
        type: String,
        required: false,
        default: ''
    },
    phone: {
        type: String,
        required: false,
        default: ''
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now
    },
});

const ContactModel = mongoose.model('Contact', ContactSchema);

function Contact(body) {
    this.body = body;
    this.errors = [];
    this.contact = null;
}

Contact.prototype.register = async function() {
    this.validate();

    if (this.errors.length > 0) return;
    this.contact = await ContactModel.create(this.body);
}

Contact.prototype.validate = function() {
    this.cleanUp();

    if (this.body.email && !validator.isEmail(this.body.email)) {
        this.errors.push("E-mail must be an valid email adress!");
    }

    if (!this.body.name) this.errors.push('Name is a required field!')
    if (!this.body.email && this.body.phone) {
        this.errors.push('At least one contact must be sent: e-mail or phone!')
    }
}

Contact.prototype.cleanUp = function() {
    for (const key in this.body) {
        if(typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
        name: this.body.name,
        surname: this.body.surname,
        email: this.body.email,
        phone: this.body.phone,
    };
}

Contact.prototype.edit = async function(id) {
    if (typeof id !== 'string') return;

    this.validate();

    if (this.errors.length > 0) return;

    this.contact = await ContactModel.findByIdAndUpdate({ _id: id }, this.body, { new: true });
}

// Static Methods
Contact.findById = async function(id) {
    if (typeof id !== 'string') return;

    const contact = await ContactModel.findById({ _id: id });

    return contact;
}

Contact.findContacts = async function() {
    const contact = await ContactModel
        .find()
        .sort({ createdAt: 1 });
    return contact;
}

Contact.delete = async function(id) {
    if (typeof id !== 'string') return;

    const contact = await ContactModel.findOneAndDelete({ _id: id });
    
    return contact;
}

module.exports = Contact;