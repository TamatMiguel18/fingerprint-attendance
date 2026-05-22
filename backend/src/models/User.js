const db = require("../config/db");

const createUser = async (name, email, password, role = 'student', group_id = null, status = 'active') => {
    const [result] = await db.query(
        "INSERT INTO users (name, email, password, role, group_id, status) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, password, role, group_id, status]
    );
    return result;
};

const getUsers = async () => {
    const [rows] = await db.query(`
        SELECT u.id, u.name, u.email, u.role, u.status, u.group_id, g.name AS group_name
        FROM users u
        LEFT JOIN groupss g ON u.group_id = g.id
    `);
    return rows;
};

const getUserById = async (id) => {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
};

const getUserByEmail = async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
};

const deleteUser = async (id) => {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result;
};

const updateUserStatus = async (id, status) => {
    const [result] = await db.query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
    return result;
};

const saveWebAuthnPasskey = async (userId, webauthnUserId, credentialId, publicKey, counter, transports) => {
    const [result] = await db.query(
        "INSERT INTO passkeys (user_id, webauthn_user_id, credential_id, public_key, counter, transports) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, webauthnUserId, credentialId, publicKey, counter, JSON.stringify(transports)]
    );
    return result;
};

const getPasskeyByCredentialId = async (credentialId) => {
    const [rows] = await db.query("SELECT * FROM passkeys WHERE credential_id = ?", [credentialId]);
    return rows[0];
};

const getPasskeysByUserId = async (userId) => {
    const [rows] = await db.query("SELECT * FROM passkeys WHERE user_id = ?", [userId]);
    return rows;
};

const updatePasskeyCounter = async (credentialId, newCounter) => {
    const [result] = await db.query("UPDATE passkeys SET counter = ? WHERE credential_id = ?", [newCounter, credentialId]);
    return result;
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    getUserByEmail,
    deleteUser,
    updateUserStatus,
    saveWebAuthnPasskey,
    getPasskeyByCredentialId,
    getPasskeysByUserId,
    updatePasskeyCounter
};