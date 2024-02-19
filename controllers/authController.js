const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database');

const config = require('../config/config');
const secret_key = config.secretKey;

// Register
exports.registerUser = async (req, res) => {
    try {
        const { name, username, password, role_id, num, email, address } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Require input across all fields
        if (!name || !username || !password || !role_id || !num || !email || !address) {
            return res.status(400).json({ error: 'Invalid input', message: 'Please provide name, username, password, and role id' });
        }

        const connection = await pool.getConnection();
        try {
            const insertUserQuery = 'INSERT INTO users (name, username, password, role_id, num, email, address) VALUES (?, ?, ?, ?, ?, ?, ?)';
            await connection.query(insertUserQuery, [name, username, hashedPassword, role_id, num, email, address]);

            res.status(201).json({ message: 'User registered successfully!' });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error registering user', error);

        // Avoid duplicate username
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('username')) {
                return res.status(409).json({ error: 'Username already exists', message: 'Please choose a different username' });
            } else {
                return res.status(409).json({ error: 'Mobile number is already taken', message: 'Please choose a different mobile number' });
            }
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Login
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const connection = await pool.getConnection();
        try {
            const getUserQuery = 'SELECT * FROM users WHERE username = ?';
            const [rows] = await connection.query(getUserQuery, [username]);

            if (rows.length === 0) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const user = rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            const token = jwt.sign({ userId: user.id, username: user.username }, secret_key, { expiresIn: '1h' });

            res.status(200).json({ token });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error logging in user:', error.message);
        // For logging only the necessary information in the catch block
        console.error('Stack trace:', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
