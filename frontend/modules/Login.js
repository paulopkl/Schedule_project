import validator from 'validator';

export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    }

    events() {
        if (!this.form) return;
        this.form.addEventListener('submit', event => {
            event.preventDefault();
            this.validate(event);
        });
    }

    validate(event) {
        const el = event.target;
        const emailInput = el.querySelector('input[name=email]');
        const passwordInput = el.querySelector('input[name=password]');
        let error = false;

        if (!validator.isEmail(emailInput.value)) {
            document.body.querySelectorAll(`input[name=email]`)[this.form.classList[0].includes('login') ? 1 : 0]
                .parentNode.innerHTML += '<div class="text-danger">Invalid E-mail</div>';
            error = true;
        }
        
        if (passwordInput.value.length < 3 || passwordInput.value.length > 50) {
            document.body.querySelectorAll(`input[name=password]`)[this.form.classList[0].includes('login') ? 1 : 0]
                .parentNode.innerHTML += `
                    <div class="text-danger">
                        Password must be between 3 and 50 characters long!
                    </div>
                `;
            error = true;
        }

        if (!error) el.submit();

        console.log(emailInput.value, passwordInput.value);
    }
}