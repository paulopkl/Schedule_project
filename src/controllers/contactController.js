const Contact = require('../models/contactModel');

module.exports = {
    indexContact(req, res, next) {
        const contact = {}
        res.render('contact', { contact });
    },
    
    async registerContact(req, res, next) {
        try {
            const contact = new Contact(req.body);
            await contact.register();
            
            if (contact.errors.length > 0) {
                req.flash('errors', contact.errors);
                req.session.save(() => res.redirect('back'));
                return;
            }
            
            req.flash('success', "Contact signed up successfully!");
            req.session.save(() => res.redirect(`/contact/index/${contact.contact._id}`));
            return;
        } catch (error) {
            console.log(error);
            return res.render('404');
        }
    },

    async editIndex(req, res, next) {
        if (!req.params.id) return res.render('404');
        
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.render('404');

        res.render('contact', { contact });
    },

    async edit(req, res, next) {
        try {
            if (!req.params.id) return res.render('404');
            const contact = new Contact(req.body);
            await contact.edit(req.params.id);

            if (contact.errors.length > 0) {
                req.flash('errors', contact.errors);
                req.session.save(() => res.redirect('back'));
                return;
            }
            
            req.flash('success', "Contact edited successfully!");
            req.session.save(() => res.redirect(`/contact/index/${contact.contact._id}`));
            return;
        } catch(error) {
            console.log(error);
            return res.render('404');
        }
    },

    async contactDelete(req, res) {
        if (!req.params.id) return res.render('404');

        const contact = await Contact.delete(req.params.id);
        if (!contact) return res.render('404');

        req.flash('success', "Contact deleted successfully!");
        req.session.save(() => res.redirect('back'));
        return;
    }
};
