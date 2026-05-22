const db = require("../config/db");

const createAttendance = async (userId, activityId, status = 'present', verifiedByFingerprint = false) => {
    const [result] = await db.query(
        "INSERT INTO attendance (user_id, activity_id, date, time, status, verified_by_fingerprint) VALUES (?, ?, CURDATE(), CURTIME(), ?, ?)",
        [userId, activityId, status, verifiedByFingerprint]
    );
    return result;
};

const getAttendanceByActivity = async (activityId) => {
    const [rows] = await db.query(`
        SELECT a.*, u.name AS user_name, u.email AS user_email
        FROM attendance a
        JOIN users u ON a.user_id = u.id
        WHERE a.activity_id = ?
        ORDER BY a.date DESC, a.time DESC
    `, [activityId]);
    return rows;
};

const getAllAttendance = async () => {
    const [rows] = await db.query(`
        SELECT a.*, u.name AS user_name, act.name AS activity_name
        FROM attendance a
        JOIN users u ON a.user_id = u.id
        JOIN activities act ON a.activity_id = act.id
        ORDER BY a.date DESC, a.time DESC
    `);
    return rows;
};

module.exports = {
    createAttendance,
    getAttendanceByActivity,
    getAllAttendance
};