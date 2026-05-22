const db = require('./src/config/db');

async function checkDb() {
    try {
        const [rows] = await db.query("SELECT * FROM users");
        console.log("Users in DB:", rows);
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkDb();
