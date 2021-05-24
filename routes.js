const { Router } = require('express');
const { index } = require('./src/controllers/homeController');
const { loginIndex, register, login, logout } = require('./src/controllers/loginController');
const { indexContact, registerContact, editIndex, edit, contactDelete } = require('./src/controllers/contactController');
const { loginRequired } = require('./src/middlewares/middleware');

const router = Router();

// Home Route
router.route("/")
    .get(index);

// Login Route
router.route('/login/index').get(loginIndex);
router.route('/login/register').post(register);
router.route('/login/enter').post(login)
router.route('/login/logout').get(logout)

// Contact Route
router.route('/contact/index').get(loginRequired, indexContact);
router.route('/contact/register').post(loginRequired, registerContact);
router.route('/contact/index/:id').get(loginRequired, editIndex);
router.route('/contact/edit/:id').post(loginRequired, edit);
router.route('/contact/delete/:id').get(loginRequired, contactDelete);

module.exports = { router };
