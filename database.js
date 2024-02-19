const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'sql6.freemysqlhosting.net',
    user: 'sql6684004',
    password: 'RPi61E1X5A',
    database: 'sql6684004',
    connectionLimit: 30
});

// Testing the connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL');
        connection.release();
    } catch (err) {
        console.error('Error connecting to MySQL', err);
    }
})();

module.exports = pool; 
