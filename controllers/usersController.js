const bcrypt = require('bcrypt');
const db = require('../database');

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const connection = await db.getConnection();
        const [rows, fields] = await connection.query('SELECT id, name, role_id, num, email FROM users;');
        connection.release(); // Release the connection back to the pool
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error loading user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get single user
exports.getUser = async (req, res) => {
    const user_id = req.params.id;

    if (!user_id) {
        return res.status(400).json({ error: true, message: 'Please provide user_id' });
    }

    try {
        const connection = await db.getConnection();
        const [rows, fields] = await connection.query('SELECT id, name, username, role_id, num, email FROM users WHERE id = ?', user_id);
        connection.release(); // Release the connection back to the pool
        if (rows.length === 0) {
            // No user found with the provided ID
            return res.status(404).json({ error: true, message: 'Account does not exist' });
        }
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error loading user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    const user_id = req.params.id;
    const { name, username, password, role_id, num, email } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!user_id || !name || !username || !password || !role_id) {
            return res.status(400).json({ error: 'Invalid input', message: 'Please provide name, username, password, role_id, num, and email' });
        }

        const connection = await db.getConnection();
        const [result, fields] = await connection.query('UPDATE users SET name = ?, username = ?, password = ?, role_id = ?, num = ?, email = ? WHERE id = ?',
            [name, username, hashedPassword, role_id, num, email, user_id]);
        connection.release(); // Release the connection back to the pool
        if (result.affectedRows === 0) {
            // No user found with the provided ID
            return res.status(404).json({ error: true, message: 'Account does not exist' });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    const user_id = req.params.id;

    if (!user_id) {
        return res.status(400).json({ error: true, message: 'Please provide user_id' });
    }

    try {
        const connection = await db.getConnection();
        const [result, fields] = await connection.query('DELETE FROM users WHERE id = ?', user_id);
        connection.release(); // Release the connection back to the pool
        if (result.affectedRows > 0) {
            // Check if any rows were affected (indicating successful deletion)
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            // No rows affected means user with specified ID was not found
            res.status(404).json({ error: true, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
