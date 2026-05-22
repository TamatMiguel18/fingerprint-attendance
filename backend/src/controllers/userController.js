const User = require("../models/User");

exports.getUsers = async (req, res) => {
    try {
        const users = await User.getUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createUser = async (req, res) => {
    let { name, email, role, group_id } = req.body;
    
    if (!email) {
        email = `feligres_${Date.now()}_${Math.floor(Math.random() * 1000)}@parroquia.local`;
    }

    try {
        await User.createUser(name, email, null, role, group_id, 'active');
        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.approveAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        await User.updateUserStatus(id, 'active');
        res.json({ message: "Admin approved" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.deleteUser(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};