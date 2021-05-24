middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
}

otherMiddleware = (req, res, next) => {
    next();
}

checkCsrfError = (err, req, res, next) => {
    // if (err?.code === "EBADCSRFTOKEN") return res.render('404');
    if (err) return res.render('404');

    next();
}

csfrMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
}

loginRequired = (req, res, next) => {
    if (!req.session.user) {
        req.flash('errors', "You need Log In!");
        req.session.save(() => res.redirect('/'));
        return;
    }

    next();
}

module.exports = { middlewareGlobal, otherMiddleware, checkCsrfError, csfrMiddleware, loginRequired };
