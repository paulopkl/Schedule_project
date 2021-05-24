const { Login } = require('../models/LoginModel');

module.exports = {
    loginIndex(req, res) {
        if(req.session.user) return res.render('login-logged');
        // console.log(req.session.user);
        res.render('login');
    },

    async login(req, res) {
        try {
            const login = new Login(req.body);
            await login.login();

            if (login.errors.length > 0) {
                req.flash('errors', login.errors);
                req.session.save(() => res.redirect('back'));
                
                return;
            }
            
            req.flash('success', 'Logged successfully.');
            req.session.user = login.user;
            req.session.save(() => res.redirect('index'));
        } catch (err) {
            console.log(err);
            return res.render('404');
        }
    },

    async register(req, res) {
        try {
            const login = new Login(req.body);
            await login.register();

            if (login.errors.length > 0) {
                req.flash('errors', login.errors);
                req.session.save(() => res.redirect('back'));
                
                return;
            }
            
            req.flash('success', 'Your user was created successfully.');
            req.session.save(() => res.redirect('back'));
        } catch (err) {
            console.log(err);
            return res.render('404');
        }
    },

    logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }
}