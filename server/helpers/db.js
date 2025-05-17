const config = require('../config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    try {
        const dbConfig = config.database;
        
        console.log('Connecting to MySQL server...');
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password
        });

        console.log('Creating database if it doesn\'t exist...');
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
        await connection.end();

        // connect to db
        console.log('Connecting to database with Sequelize...');
        const sequelize = new Sequelize(
            dbConfig.database,
            dbConfig.user,
            dbConfig.password,
            {
                host: dbConfig.host,
                port: dbConfig.port,
                dialect: dbConfig.dialect || 'mysql',
                dialectOptions: dbConfig.dialectOptions,
                logging: false,
                pool: dbConfig.pool
            }
        );

        // test connection
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // init models and add them to the exported db object
        db.Account = require('../accounts/account.model')(sequelize);
        db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);

        // define relationships
        db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
        db.RefreshToken.belongsTo(db.Account);

        // sync all models with database
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('Please make sure MySQL server is running and the connection details are correct.');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Access denied. Please check your username and password.');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('Database does not exist.');
        }
        process.exit(1);
    }
} 