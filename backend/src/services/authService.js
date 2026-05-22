// backend/src/services/authService.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwtConfig");

const register = (data, callback) => {
    const hashedPassword = bcrypt.hashSync(data.password, 10);

    const newUser = {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "user"
    };

    User.createUser(newUser, callback);
};
const login = ({ email, password }) => {
    const sql = "SELECT * FROM users WHERE email = ?";

    return new Promise((resolve, reject) => {
        db.query(sql, [email], async (err, results) => {
            if (err) return reject(err);

            if (results.length === 0) {
                return reject(new Error("User not found"));
            }

            const user = results[0];

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return reject(new Error("Invalid credentials"));
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT.SECRET,
                { expiresIn: JWT.EXPIRES }
            );

            resolve({ token });
        });
    });
};

module.exports = {
    register,
    login
};