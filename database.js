const mysql = require('mysql2/promise');

const poolConfig = {
    host: 'sql6.freemysqlhosting.net',
    user: 'sql6684004',
    password: 'RPi61E1X5A',
    database: 'sql6684004',
    connectionLimit: 30
};

const pool = mysql.createPool(poolConfig);

module.exports = pool;