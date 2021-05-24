const Contact = require('../models/contactModel');

module.exports = {
    async index(req, res, next) {
        const contacts = await Contact.findContacts();

        res.render('index', { contacts });
    }
};
