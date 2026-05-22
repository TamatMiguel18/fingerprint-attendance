const db = require("../config/db");

const createActivity = async (name, date, groupId, requiresFingerprint, createdBy) => {
    const [result] = await db.query(
        "INSERT INTO activities (name, date, group_id, requires_fingerprint, created_by) VALUES (?, ?, ?, ?, ?)",
        [name, date, groupId, requiresFingerprint, createdBy]
    );
    return result;
};

const getActivities = async (userId, role) => {
    let query = `
        SELECT a.*, g.name AS group_name, u.name AS creator_name
        FROM activities a
        LEFT JOIN groupss g ON a.group_id = g.id
        LEFT JOIN users u ON a.created_by = u.id
    `;
    const params = [];
    if (role !== 'superadmin') {
        query += " WHERE a.created_by = ?";
        params.push(userId);
    }
    query += " ORDER BY a.date DESC";
    
    const [rows] = await db.query(query, params);
    return rows;
};

const getActivityById = async (id) => {
    const [rows] = await db.query("SELECT * FROM activities WHERE id = ?", [id]);
    return rows[0];
};

const deleteActivity = async (id) => {
    const [result] = await db.query("DELETE FROM activities WHERE id = ?", [id]);
    return result;
};

module.exports = {
    createActivity,
    getActivities,
    getActivityById,
    deleteActivity
};