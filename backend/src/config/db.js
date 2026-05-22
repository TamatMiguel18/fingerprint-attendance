// backend/src/config/db.js
const mysql = require("mysql2/promise");
const { DB } = require("./env");

const pool = mysql.createPool({
    host: DB.HOST,
    user: DB.USER,
    password: DB.PASSWORD,
    database: DB.NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

// Test connection
pool.getConnection()
    .then(conn => {
        console.log("Connected to MySQL (Promise Pool)");
        conn.release();
    })
    .catch(err => {
        console.error("Error connecting to MySQL:", err);
    });

module.exports = pool;