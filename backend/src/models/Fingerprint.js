const db = require("../config/db");

const saveFingerprint = (user_id, fingerprint_hash) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO fingerprints (user_id, fingerprint_hash)
            VALUES (?, ?)
        `;

        db.query(query, [user_id, fingerprint_hash], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const findUserByFingerprint = (fingerprint_hash) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT u.*
            FROM fingerprints f
            JOIN users u ON f.user_id = u.id
            WHERE f.fingerprint_hash = ?
        `;

        db.query(query, [fingerprint_hash], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};

module.exports = {
    saveFingerprint,
    findUserByFingerprint
};