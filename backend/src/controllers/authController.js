const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { JWT } = require("../config/env");

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.getUserByEmail(email);

        if (!user || user.role === 'student') {
            return res.status(401).json({ message: "Invalid credentials or unauthorized role" });
        }

        if (user.status !== 'active') {
            return res.status(403).json({ message: "Account is pending approval" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        jwt.sign(
            payload,
            JWT.SECRET,
            { expiresIn: JWT.EXPIRES },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.getUserByEmail(email);
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.createUser(name, email, hashedPassword, 'admin', null, 'pending');
        
        res.status(201).json({ message: "Admin registration request submitted. Waiting for superadmin approval." });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.getUserById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

module.exports = {
    login,
    registerAdmin,
    getMe
};