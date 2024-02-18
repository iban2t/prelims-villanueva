const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'sql6.freemysqlhosting.net',
    user: 'sql6684004',
    password: 'RPi61E1X5A',
    database: 'sql6684004'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL', err);
    } else {
        console.log('Connected to MySQL');
    }
});

module.exports = db; 