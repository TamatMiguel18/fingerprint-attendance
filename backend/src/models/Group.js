const db = require("../config/db");

const createGroup = async (name, description) => {
    const [result] = await db.query(
        "INSERT INTO groupss (name, description) VALUES (?, ?)",
        [name, description]
    );
    return result;
};

const getGroups = async () => {
    const [rows] = await db.query("SELECT * FROM groupss");
    return rows;
};

const getGroupById = async (id) => {
    const [rows] = await db.query("SELECT * FROM groupss WHERE id = ?", [id]);
    return rows[0];
};

const deleteGroup = async (id) => {
    const [result] = await db.query("DELETE FROM groupss WHERE id = ?", [id]);
    return result;
};

module.exports = {
    createGroup,
    getGroups,
    getGroupById,
    deleteGroup
};