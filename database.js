const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'iv4nvi11anueva;',
    database: 'p3'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL', err);
    } else {
        console.log('Connected to MySQL');
    }
});

module.exports = db;