const Attendance = require("../models/Attendance");

exports.getAllAttendance = async (req, res) => {
    try {
        const records = await Attendance.getAllAttendance();
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAttendanceByActivity = async (req, res) => {
    try {
        const records = await Attendance.getAttendanceByActivity(req.params.activityId);
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createAttendance = async (req, res) => {
    const { userId, activityId, status } = req.body;
    try {
        await Attendance.createAttendance(userId, activityId, status, false);
        res.status(201).json({ message: "Attendance marked manually" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};