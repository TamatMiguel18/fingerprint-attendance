const Activity = require("../models/Activity");

exports.getActivities = async (req, res) => {
    try {
        const activities = await Activity.getActivities(req.user.id, req.user.role);
        res.json(activities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createActivity = async (req, res) => {
    const { name, date, groupId, requiresFingerprint } = req.body;
    try {
        await Activity.createActivity(name, date, groupId, requiresFingerprint, req.user.id);
        res.status(201).json({ message: "Activity created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteActivity = async (req, res) => {
    try {
        await Activity.deleteActivity(req.params.id);
        res.json({ message: "Activity deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};