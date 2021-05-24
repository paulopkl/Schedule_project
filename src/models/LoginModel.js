const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async register() {
        this.validate();

        if (this.errors.length > 0) return;
        
        await this.userExists();
        
        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        const user = await LoginModel.create({ ...this.body });
        this.user = user;
    }

    async login() {
        this.validate();

        if (this.errors.length > 0) return;
        
        this.user = await LoginModel.findOne({ email: this.body.email });

        if (!this.user) {
            this.errors.push('User not found!');
            return;
        }

        if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Invalid User or password!');
            this.user = null;
            return;
        }
    }

    async userExists() {
        const user = await LoginModel.findOne({ email: this.body.email });
        this.user = user;

        if (this.user) this.errors.push('User already exists!');
    }

    validate() {
        this.cleanUp();

        if (!validator.isEmail(this.body.email)) this.errors.push("E-mail must be an valid email adress!");
        if (this.body.password.length < 3 || this.body.password.length >= 50) {
            this.errors.push("Password must be between 3 and 50 characters long!");
        }
    }

    cleanUp() {
        for (const key in this.body) {
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
}

module.exports = { Login };
