const config = require('../config.json');

module.exports = {
    development: {
        username: config.db.user,
        password: config.db.password,
        database: config.db.name,
        host: config.db.host,
        dialect: 'mysql'
    },
    test: {
        username: config.db.user,
        password: config.db.password,
        database: config.db.name,
        host: config.db.host,
        dialect: 'mysql'
    },
    production: {
        username: config.db.user,
        password: config.db.password,
        database: config.db.name,
        host: config.db.host,
        dialect: 'mysql'
    }
}; 