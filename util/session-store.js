const session = require('express-session');

const MySqlStore = require('express-mysql-session')(session);

const dbValue = require('./database-values');

const store = new MySqlStore({
    host: dbValue.host,
    user: dbValue.user,
    password: dbValue.password,
    database: dbValue.database
});

module.exports = store;