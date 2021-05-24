require('dotenv').config();
const express = require('express');
const app = express();
const { router } = require('./routes');
const path = require('path');
const csrf = require('csurf');
const mongoose = require('mongoose');
const { middlewareGlobal, checkCsrfError, csfrMiddleware } = require('./src/middlewares/middleware');
// const helmet = require('helmet');

// Connect to mongoose
mongoose.connect(process.env.URL_DATABASE, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: true
})
    .then(() => {
        console.log("Connect to Database!");
        app.emit('ready');
    })
    .catch(err => console.error(err));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// app.use(helmet); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Configuration to define the root directory to sending raw files
app.use(express.static(path.resolve(__dirname, "public")));


const sessionOptions = session({
    secret: 'dasdldsakdsalk dasdasdsa dasdsa dsadsa dsa sda das asd',
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
    store: MongoStore.create({ mongoUrl: process.env.URL_DATABASE }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (7 * 24 * (60 * (60 * 1000))),
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());

// Configurations to define EJS as default
app.set('views', path.resolve(__dirname, "src", "views"));
app.set('view engine', 'ejs');

app.use(csrf());

// Middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csfrMiddleware);
app.use(router);

app.on('ready', () => {
    const port = 3333;
    app.listen(port, () => {
        console.log(`App is running on http://localhost:${port}`);
    });
})
