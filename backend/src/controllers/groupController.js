const Group = require("../models/Group");

exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.getGroups();
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createGroup = async (req, res) => {
    const { name, description } = req.body;
    try {
        await Group.createGroup(name, description);
        res.status(201).json({ message: "Group created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        await Group.deleteGroup(req.params.id);
        res.json({ message: "Group deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};