var routes = require('./routes/index');
var login = require('./routes/home');

module.exports = function (app) {

    /* Index(main) route */
    app.use('/', routes);
    app.use('/index', routes);
    app.use('/index.html', routes);
    app.use('/login', login);
    app.use('/login.html', login);
    app.use('/logout', logout);
};