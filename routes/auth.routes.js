const express = require('express');
const bcrypt = require('bcrypt');
const jwtUtils = require('jsonwebtoken');
require('dotenv').config();

module.exports = (connection) => {
    const router = express.Router();

    router.post('/register', (request, response) => {
        const user = request.body;
        const passwordHash = bcrypt.hashSync(user.password, 10);

        connection.query(
            'INSERT INTO users(user_email, user_password, role_id, structure_id) VALUES (?, ?, ?, ?)',
            [user.email, passwordHash, 1, 1],
            (error, result) => {
                if (error && error.code === 'ER_DUP_ENTRY') {
                    return response.sendStatus(409);
                }

                if (error) {
                    console.error(error);
                    return response.sendStatus(500);
                }

                user.id = result.insertId;
                response.json(user);
            }
        );
    });

    router.post('/login', (request, response) => {
        const { email, password } = request.body;

        connection.query(`
            SELECT u.user_id, u.user_email, u.user_password, r.role_label
            FROM users u 
            JOIN roles r ON u.role_id = r.role_id
            WHERE u.user_email = ?`,
            [email],
            (error, users) => {
                if (error) {
                    console.error(error);
                    return response.sendStatus(500);
                }

                if (users.length === 0) {
                    return response.sendStatus(401);
                }

                const user = users[0];
                const passwordIsValid = bcrypt.compareSync(password, user.user_password);

                if (!passwordIsValid) {
                    return response.sendStatus(401);
                }

                const token = jwtUtils.sign(
                    {
                        sub: user.user_email,
                        role: user.role_label,
                        id: user.user_id,
                    },
                    process.env.JWT_SECRET
                );

                response.json({ token });
            }
        );
    });

    return router;
};
